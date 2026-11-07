const {
  sequelize,
  Lead,
  LeadTrip,
  MastersAirport,
  MastersAircraftModel,
  User,
} = require("../../models");
const { Op } = require("sequelize");
const status = require("../../helpers/Response");
const sendMail = require("../../helpers/sendMail");
const { NOTI_MAIL } = process.env;
const { validationResult } = require("express-validator");

const aircraft_preparing_hours = 3;

async function isPreparableTrip(isoDate1 = "", isoDate2 = "", res) {
  // Convert ISO strings to Date objects
  try {
    const date1 = new Date(isoDate1);
    const date2 = new Date(isoDate2);
    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(date2 - date1);

    // Calculate the number of milliseconds in 2 hours
    const twoHoursInMilliseconds = aircraft_preparing_hours * 60 * 60 * 1000;

    // Check if the time difference is at least 2 hours
    return timeDifference >= twoHoursInMilliseconds;
  } catch (error) {
    return status.ResponseStatus(
      res,
      400,
      `Invalid date & time formate. Required ISO 8601 format`
    );
  }
}

module.exports = {
  enquiry: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      const { user_id } = req.session_data;
      const {
        name,
        email,
        phone,
        remark,
        aircraft_id,
        type = "",
        data = [],
      } = req.body;

      if (!data.length)
        return status.ResponseStatus(res, 400, "Trip data should not be empty");
      if (type === "oneway" && data.length > 1)
        return status.ResponseStatus(
          res,
          400,
          `One way journey should have only one transit`
        );
      if (type === "roundtrip" && data.length !== 2)
        return status.ResponseStatus(
          res,
          400,
          `Round trip journey should have only two transit`
        );
      if (type === "multicity" && data.length < 2)
        return status.ResponseStatus(
          res,
          400,
          `Multicity journey should have at least two transit`
        );

      const selectedAircraft = await MastersAircraftModel.findByPk(aircraft_id);
      if (!selectedAircraft)
        return status.ResponseStatus(res, 400, "Ivalid Aircraft ID");

      const firstAirport = await MastersAirport.findByPk(
        data[0].departure_airport_id
      );
      const first_airport_id = firstAirport ? firstAirport.id : null;

      const lastAirport = await MastersAirport.findByPk(
        data[data.length - 1].arrival_airport_id
      );
      const last_airport_id = lastAirport ? lastAirport.id : null;

      let next_departure_id = data[0].departure_airport_id;
      let trip = [];
      for (let i = 0; i < data.length; i++) {
        const {
          departure_airport_id,
          arrival_airport_id,
          pax = 0,
          start_at,
        } = data[i];

        if (departure_airport_id === arrival_airport_id)
          return status.ResponseStatus(
            res,
            400,
            `Departure airport and arrival airport can't be same airport`
          );

        if (
          next_departure_id != departure_airport_id ||
          (type === "roundtrip" && first_airport_id !== last_airport_id)
        )
          return status.ResponseStatus(res, 400, "Invalid flight route");
        next_departure_id = arrival_airport_id;

        if (
          i != data.length - 1 &&
          !(await isPreparableTrip(start_at, data[i + 1].start_at, res))
        )
          return status.ResponseStatus(
            res,
            400,
            `The departure time of next trip should be minimum three hours from the previous trip`
          );

        const departureAirport = await MastersAirport.findByPk(
          departure_airport_id
        );
        const arrivalAirport = await MastersAirport.findByPk(
          arrival_airport_id
        );
        if (!departureAirport)
          return status.ResponseStatus(
            res,
            400,
            `Can't find the airport with the id-${departure_airport_id}`
          );
        if (!arrivalAirport)
          return status.ResponseStatus(
            res,
            400,
            `Can't find the airport with the id-${arrival_airport_id}`
          );
        trip.push({
          departure_airport_id,
          arrival_airport_id,
          pax,
          start_at: start_at.slice(0, 19).replace("T", " "),
        });
      }

      const leadData = {
        name,
        email,
        phone,
        remark,
        type,
        aircraft_id,
        status: "New",
        trip,
        created_by: user_id,
        updated_by: user_id,
      };

      const result = await Lead.create(leadData, {
        include: ["trip"],
      });
      //     console.log(result.id);
      if (!result)
        return status.ResponseStatus(res, 400, "Failed to send the request.");

      const notiSubject = "New Quotation Enquiry Submitted by Customer";
      const notiContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
            }
            .container {
              width: 80%;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 10px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #0073e6;
              color: #ffffff;
              padding: 10px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              padding: 20px;
            }
            .footer {
              padding: 10px;
              text-align: center;
              font-size: 0.9em;
              color: #777777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Sparzana Aviation - Customer Enquiry Notification</h2>
            </div>
            <div class="content">
              <p>Dear Team,</p>
              <p>We have received a new quotation enquiry form submission from a customer. Please find the details below:</p>
              <table>
              <tr>
              <td><strong>Lead No:</strong></td>
              <td>SAPL/LD-${String(result.id).padStart(4, "0")}</td>
            </tr>
                <tr>
                  <td><strong>Customer Name:</strong></td>
                  <td>${result.name}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>${result.email}</td>
                </tr>
                <tr>
                  <td><strong>Phone:</strong></td>
                  <td>${result.phone}</td>
                </tr>
                <tr>
                  <td><strong>Aircraft ID:</strong></td>
                  <td>${selectedAircraft.aircraft_manufacture} ${
        selectedAircraft.aircraft_model
      }</td>
                </tr>
                <tr>
                  <td><strong>Flight Type:</strong></td>
                  <td>${result.type}</td>
                </tr>
                <tr>
                  <td><strong>Remark:</strong></td>
                  <td>${result.remark}</td>
                </tr>

              </table>
              <p>Please follow up with the customer as soon as possible to address their enquiry and provide the necessary assistance.</p>
              <p>Thank you,</p>
              <p><strong>Sparzana Aviation Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      //   <tr>
      //   <td><strong>Trip Details:</strong></td>
      //   <td>${customerData.quotation.trip.map(detail => detail.detail).join(', ')}</td>
      // </tr>
      // <tr>
      //   <td><strong>Charges:</strong></td>
      //   <td>${customerData.quotation.charges.map(charge => `${charge.title}: $${charge.value}`).join(', ')}</td>
      // </tr>

      sendMail(NOTI_MAIL, notiSubject, notiContent, (error, info) => {
        // console.log(info);
        // console.log(error);
        if (error) {
          // console.error("Failed to send email:", error);
          return status.ResponseStatus(
            res,
            500,
            `Failed to send email. ${error}`
          );
        }
      });

      return status.ResponseSuccess(
        res,
        "Your request has been sent, our team will contact you shortly"
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  getNextNumber: async (req, res) => {
    try {
      const maxIdResult = await Lead.max("id");
      const nextId = (maxIdResult || 0) + 1;
      const next_number = `SAPL/LD-${String(nextId).padStart(4, "0")}`;
      res.status(200).json(next_number);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  createLead: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      const { user_id } = req.session_data;
      const {
        name,
        email,
        phone,
        remark,
        aircraft_id,
        type = "",
        trips = [],
      } = req.body;

      if (!trips.length)
        return status.ResponseStatus(res, 400, "Trips should not be empty");
      if (type === "oneway" && trips.length > 1)
        return status.ResponseStatus(
          res,
          400,
          `One way journey should have only one transit`
        );
      if (type === "roundtrip" && trips.length !== 2)
        return status.ResponseStatus(
          res,
          400,
          `Round trip journey should have only two transit`
        );
      if (type === "multicity" && trips.length < 2)
        return status.ResponseStatus(
          res,
          400,
          `Multicity journey should have at least two transit`
        );

      const selectedAircraft = await MastersAircraftModel.findByPk(aircraft_id);
      if (!selectedAircraft)
        return status.ResponseStatus(res, 400, "Ivalid Aircraft ID");

      const firstAirport = await MastersAirport.findByPk(
        trips[0].departure_airport_id
      );
      const first_airport_id = firstAirport ? firstAirport.id : null;

      const lastAirport = await MastersAirport.findByPk(
        trips[trips.length - 1].arrival_airport_id
      );
      const last_airport_id = lastAirport ? lastAirport.id : null;

      let next_departure_id = trips[0].departure_airport_id;
      let trip = [];
      for (let i = 0; i < trips.length; i++) {
        const {
          departure_airport_id,
          arrival_airport_id,
          pax = 0,
          start_at,
        } = trips[i];

        if (departure_airport_id === arrival_airport_id)
          return status.ResponseStatus(
            res,
            400,
            `Departure airport and arrival airport can't be same airport`
          );

        if (
          next_departure_id != departure_airport_id ||
          (type === "roundtrip" && first_airport_id !== last_airport_id)
        )
          return status.ResponseStatus(res, 400, "Invalid flight route");
        next_departure_id = arrival_airport_id;

        if (
          i != trips.length - 1 &&
          !(await isPreparableTrip(start_at, trips[i + 1].start_at, res))
        )
          return status.ResponseStatus(
            res,
            400,
            `The departure time of next trip should be minimum three hours from the previous trip`
          );

        const departureAirport = await MastersAirport.findByPk(
          departure_airport_id
        );
        const arrivalAirport = await MastersAirport.findByPk(
          arrival_airport_id
        );
        if (!departureAirport)
          return status.ResponseStatus(
            res,
            400,
            `Can't find the airport with the id-${departure_airport_id}`
          );
        if (!arrivalAirport)
          return status.ResponseStatus(
            res,
            400,
            `Can't find the airport with the id-${arrival_airport_id}`
          );
        trip.push({
          departure_airport_id,
          arrival_airport_id,
          pax,
          start_at: start_at.slice(0, 19).replace("T", " "),
        });
      }

      const leadData = {
        name,
        email,
        phone,
        remark,
        type,
        aircraft_id,
        status: "New",
        trip,
        created_by: user_id,
        updated_by: user_id,
      };

      const result = await Lead.create(leadData, {
        include: ["trip"],
      });
      //     console.log(result.id);
      if (!result)
        return status.ResponseStatus(res, 400, "Failed to send the request.");

      const user = await User.findByPk(user_id);

      const notiSubject = `New Lead has been created by ${user.email}`;
      const notiContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
            }
            .container {
              width: 80%;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 10px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #0073e6;
              color: #ffffff;
              padding: 10px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              padding: 20px;
            }
            .footer {
              padding: 10px;
              text-align: center;
              font-size: 0.9em;
              color: #777777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Sparzana Aviation - New Lead Created Notification</h2>
            </div>
            <div class="content">
              <p>Dear Team,</p>
              <p>We have received a new lead has been created by user(${
                user.email
              }). Please find the details below:</p>
              <table>
              <tr>
              <td><strong>Lead No:</strong></td>
              <td>SAPL/LD-${String(result.id).padStart(4, "0")}</td>
            </tr>
                <tr>
                  <td><strong>Customer Name:</strong></td>
                  <td>${result.name}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>${result.email}</td>
                </tr>
                <tr>
                  <td><strong>Phone:</strong></td>
                  <td>${result.phone}</td>
                </tr>
                <tr>
                  <td><strong>Aircraft ID:</strong></td>
                  <td>${selectedAircraft.aircraft_manufacture} ${
        selectedAircraft.aircraft_model
      }</td>
                </tr>
                <tr>
                  <td><strong>Flight Type:</strong></td>
                  <td>${result.type}</td>
                </tr>
                <tr>
                  <td><strong>Remark:</strong></td>
                  <td>${result.remark}</td>
                </tr>

              </table>
              <p>Please follow up with the customer as soon as possible to address their enquiry and provide the necessary assistance.</p>
              <p>Thank you,</p>
              <p><strong>Sparzana Aviation Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      //   <tr>
      //   <td><strong>Trip Details:</strong></td>
      //   <td>${customerData.quotation.trip.map(detail => detail.detail).join(', ')}</td>
      // </tr>
      // <tr>
      //   <td><strong>Charges:</strong></td>
      //   <td>${customerData.quotation.charges.map(charge => `${charge.title}: $${charge.value}`).join(', ')}</td>
      // </tr>

      sendMail(NOTI_MAIL, notiSubject, notiContent, (error, info) => {
        // console.log(info);
        // console.log(error);
        if (error) {
          // console.error("Failed to send email:", error);
          return status.ResponseStatus(
            res,
            500,
            `Failed to send email. ${error}`
          );
        }
      });

      return status.ResponseSuccess(res, "Lead created successfully");
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  updateLead: async (req, res) => {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { id } = req.params;
      const { user_id } = req.session_data;
      const {
        name,
        email,
        phone,
        remark,
        type,
        aircraft_id,
        status_change = "New",
        trip = [],
      } = req.body;

      // Check if the lead exists
      const existingLead = await Lead.findByPk(id);
      if (!existingLead) {
        return status.ResponseStatus(res, 404, "Lead not found");
      }

      // Update lead data
      const leadData = {
        name,
        email,
        phone,
        remark,
        type,
        aircraft_id,
        status: status_change,
        updated_by: user_id,
      };

      await Lead.update(leadData, { where: { id }, transaction });

      // Update associated trips
      const existingTrips = await LeadTrip.findAll({ where: { lead_id: id } });
      const existingTripIds = existingTrips.map((trip) => trip.id);

      const newTrips = trip.filter((t) => !t.id); // New trips to add
      const updatedTrips = trip.filter(
        (t) => t.id && existingTripIds.includes(t.id)
      );
      const deletedTripIds = existingTripIds.filter(
        (existingId) => !trip.some((t) => t.id === existingId)
      );

      // Add new trips
      if (newTrips.length) {
        const newTripData = newTrips.map((t) => ({ ...t, lead_id: id }));
        await LeadTrip.bulkCreate(newTripData, { transaction });
      }

      // Update existing trips
      for (const t of updatedTrips) {
        await LeadTrip.update(t, { where: { id: t.id }, transaction });
      }

      // Delete removed trips
      if (deletedTripIds.length) {
        await LeadTrip.destroy({ where: { id: deletedTripIds }, transaction });
      }

      await transaction.commit(); // Commit transaction
      return status.ResponseStatus(res, 200, "Lead updated successfully");
    } catch (error) {
      await transaction.rollback(); // Rollback on error
      console.error(error);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  listLeads: async (req, res) => {
    try {
      const {
        page = 1,
        size = 10,
        sort = "id",
        order = "asc",
        search_field = "",
        search_term = "",
      } = req.query;

      const limit = parseInt(size);
      const offset = (page - 1) * limit;

      let whereClause = {};
      let includeClause = [
        {
          association: "aircraft",
          attributes: [
            "aircraft_manufacture",
            "aircraft_model",
            "aircraft_type",
          ],
        },
        { association: "trip" },
        { association: "creator", attributes: ["full_name", "email", "role"] },
        { association: "updater", attributes: ["full_name", "email", "role"] },
      ];

      if (search_field && search_term) {
        if (search_field.includes(".")) {
          const [association, field] = search_field.split(".");
          includeClause = includeClause.map((include) => {
            if (include.association === association) {
              include.where = {
                [field]: { [Op.like]: `%${search_term}%` },
              };
              include.required = true; // Ensures only results matching the condition are included
            }
            return include;
          });
        } else {
          whereClause[search_field] = { [Op.like]: `%${search_term}%` };
        }
      }

      // Separate count query
      const countResult = await Lead.count({
        where: whereClause,
        include: includeClause.map((include) => ({
          association: include.association,
          required: include.required,
          where: include.where,
        })),
        distinct: true, // Ensures distinct counting
      });

      // Fetch data with pagination
      const rows = await Lead.findAll({
        where: whereClause,
        include: includeClause,
        order: [[sort, order]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(countResult / limit);

      const info = {
        total_items: countResult,
        total_pages: totalPages,
        current_page: parseInt(page),
      };

      if (!rows.length) {
        return status.ResponseStatus(res, 404, "No data available");
      }

      return status.ResponseStatus(res, 200, "List of all leads", rows, info);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  detailLead: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Lead.findByPk(id, {
        include: [
          {
            association: "trip",
            include: [
              { association: "departure_airport", include: ["city"] },
              { association: "arrival_airport", include: ["city"] },
            ],
          },
          { association: "aircraft" },
          {
            association: "creator",
            attributes: ["full_name", "email", "role"],
          },
          {
            association: "updater",
            attributes: ["full_name", "email", "role"],
          },
        ],
      });

      if (!result)
        return status.ResponseStatus(res, 404, `Lead not found with id-${id}`);

      return status.ResponseStatus(
        res,
        200,
        `Details of lead with id-${id}`,
        result
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  deleteLeads: async (req, res) => {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const { lead_ids = [] } = req.body;

      if (!lead_ids.length) {
        return status.ResponseStatus(res, 400, "No Lead IDs provided");
      }

      // Fetch existing Leads
      const existingLeads = await Lead.findAll({
        where: { id: lead_ids },
        attributes: ["id"],
      });

      const existingIds = existingLeads.map((lead) => lead.id);
      const nonExistingIds = lead_ids.filter((id) => !existingIds.includes(id));

      if (!existingIds.length) {
        await transaction.rollback();
        return status.ResponseStatus(res, 404, "No matching Leads found");
      }

      try {
        // Delete child records from LeadTrip
        await LeadTrip.destroy({
          where: { lead_id: existingIds },
          transaction,
        });

        // Delete parent records from Lead
        const deletedCount = await Lead.destroy({
          where: { id: existingIds },
          transaction,
        });

        if (deletedCount === 0) {
          await transaction.rollback();
          return status.ResponseStatus(res, 400, "No records deleted");
        }

        // Commit transaction
        await transaction.commit();
        return status.ResponseStatus(res, 200, "Leads deleted successfully", {
          deleted_ids: existingIds,
          non_existing_ids: nonExistingIds,
        });
      } catch (childError) {
        await transaction.rollback();
        console.error("Error deleting Leads:", childError.message);
        return status.ResponseStatus(
          res,
          500,
          "Failed to delete Leads",
          childError.message
        );
      }
    } catch (error) {
      await transaction.rollback();
      console.error("Unexpected error:", error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
};
