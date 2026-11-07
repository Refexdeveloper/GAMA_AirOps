const {
  sequelize,
  ProformaInvoice,
  ProformaInvoiceTrips,
  ProformaInvoiceCharges,
  MastersAircraft,
  MastersAircraftModel,
  MastersAirport,
  MastersAircraftImage,
} = require("../../models");
const status = require("../../helpers/Response");
const { getDistance } = require("geolib");
const fs = require("fs");
const xlsx = require("xlsx");
const puppeteer = require("puppeteer");
const path = require("path");
const { validationResult } = require("express-validator");
const { Op, where } = require("sequelize");
const { APP_URL } = process.env;

const resolveAircraftForPI = async ({
  aircraft_id,
  aircraft_reg_no,
  aircraft_model_name,
}) => {
  const aid = aircraft_id ? parseInt(aircraft_id, 10) : null;
  const regTrim = String(aircraft_reg_no || "").trim();
  const modelTrim = String(aircraft_model_name || "").trim();

  if (aid && !Number.isNaN(aid)) {
    const ac = await MastersAircraft.findByPk(aid, {
      include: [{ association: "model", attributes: ["aircraft_model"] }],
    });
    if (!ac) {
      return { error: "Selected aircraft was not found" };
    }
    return {
      aircraft_id: aid,
      aircraft_reg_no: ac.reg_no,
      aircraft_model_name: ac.model?.aircraft_model || modelTrim || "",
    };
  }

  if (!regTrim || !modelTrim) {
    return {
      error:
        "Select an aircraft from the list, or enter both Aircraft Regn. and Aircraft Model",
    };
  }

  return {
    aircraft_id: null,
    aircraft_reg_no: regTrim,
    aircraft_model_name: modelTrim,
  };
};

const generatePdf = async (id) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
      timeout: 60000, // Increase timeout to 60 seconds
    });

    const page = await browser.newPage();

    const website_url = `${APP_URL}/pdf/proforma_invoice/${id}`;

    // Open URL in current page
    await page.goto(website_url, { waitUntil: "networkidle0", timeout: 60000 });
    // await page.screenshot({
    //   path: "proforma_invoice.png",
    // });

    // Ensure fonts are loaded
    await page.evaluateHandle("document.fonts.ready");

    //To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");

    // const pdfPath = path.join(__dirname, "output.pdf");
    const uploadsDir = path.join(
      __dirname,
      "../../../uploads/proforma_invoices"
    );
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `proforma_invoice_${uniqueSuffix}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      // width: "1920px", // Adjust width to match viewport
      // height: "1080px", // Adjust height to match viewport
    });

    return { fileName, filePath };
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = {
  getNextNumber: async (req, res) => {
    try {
      const maxIdResult = await ProformaInvoice.max("id");
      const nextId = (maxIdResult || 0) + 1;
      const next_number = `SAPL/PI-${String(nextId).padStart(4, "0")}`;
      res.status(200).json(next_number);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  createPI: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }
      const { user_id } = req.session_data;
      const {
        bill_to,
        aircraft_id,
        aircraft_reg_no,
        aircraft_model_name,
        // type,
        // per_hour_cost,
        trips = [],
        charges = [],
        trip_cost,
        sub_total,
        discount,
        st_after_discount,
        gst,
        grand_total,
        hsn_sac,
        assigned_to,
      } = req.body;

      const aircraftResolved = await resolveAircraftForPI({
        aircraft_id,
        aircraft_reg_no,
        aircraft_model_name,
      });
      if (aircraftResolved.error) {
        return status.ResponseStatus(res, 400, aircraftResolved.error);
      }

      const proforma_invoice = {
        bill_to,
        aircraft_id: aircraftResolved.aircraft_id,
        aircraft_reg_no: aircraftResolved.aircraft_reg_no,
        aircraft_model_name: aircraftResolved.aircraft_model_name,
        // type,
        // per_hour_cost,
        // trips,
        // charges,
        trip_cost,
        sub_total,
        discount,
        st_after_discount,
        gst,
        grand_total,
        hsn_sac,
        assigned_to,
        created_by: user_id,
        updated_by: user_id,
      };

      const result = await ProformaInvoice.create(proforma_invoice);

      for (const trip of trips)
        await ProformaInvoiceTrips.create({ pi_id: result.id, ...trip });

      for (const charge of charges)
        await ProformaInvoiceCharges.create({ pi_id: result.id, ...charge });

      if (!result)
        return status.ResponseStatus(
          res,
          400,
          "Failed to create proforma invoice"
        );

      const pdf = await generatePdf(result.id);

      await ProformaInvoice.update(
        { file_name: pdf.fileName },
        { where: { id: result.id } }
      );

      return status.ResponseStatus(
        res,
        201,
        "Proforma invoice created successfully"
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  listPIs: async (req, res) => {
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
        { association: "customer" },
        { association: "aircraft", include: ["model"], required: false },
        { association: "trips" },
        { association: "charges" },
        {
          association: "allocatee",
          attributes: ["full_name", "email", "role"],
        },
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
      const countResult = await ProformaInvoice.count({
        where: whereClause,
        include: includeClause.map((include) => ({
          association: include.association,
          required: include.required,
          where: include.where,
        })),
        distinct: true, // Ensures distinct counting
      });

      // Fetch data with pagination
      const rows = await ProformaInvoice.findAll({
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

      return status.ResponseStatus(
        res,
        200,
        "List of all proforma invoice",
        rows,
        info
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  detailPI: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ProformaInvoice.findByPk(id, {
        include: [
          { association: "customer" },
          {
            association: "trips",
            include: [
              { association: "departure_airport", include: ["city"] },
              { association: "arrival_airport", include: ["city"] },
            ],
          },
          { association: "charges" },
          {
            association: "aircraft",
            required: false,
            include: [
              {
                association: "model",
                include: [
                  { association: "base_airport", include: ["city"] },
                  { association: "images" },
                ],
              },
            ],
          },
          {
            association: "allocatee",
            attributes: ["full_name", "email", "role"],
          },
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
        return status.ResponseStatus(
          res,
          404,
          `Proforma invoice not found with id-${id}`
        );

      return status.ResponseStatus(
        res,
        200,
        `Details of proforma invoice with id-${id}`,
        result
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  updatePI: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { id } = req.params;
      const { user_id } = req.session_data;
      const {
        aircraft_id,
        aircraft_reg_no,
        aircraft_model_name,
        trips = [],
        charges = [],
        trip_cost,
        sub_total,
        discount,
        st_after_discount,
        gst,
        grand_total,
        hsn_sac,
        assigned_to,
      } = req.body;

      const aircraftResolved = await resolveAircraftForPI({
        aircraft_id,
        aircraft_reg_no,
        aircraft_model_name,
      });
      if (aircraftResolved.error) {
        return status.ResponseStatus(res, 400, aircraftResolved.error);
      }

      const proforma_invoice = {
        aircraft_id: aircraftResolved.aircraft_id,
        aircraft_reg_no: aircraftResolved.aircraft_reg_no,
        aircraft_model_name: aircraftResolved.aircraft_model_name,
        trips,
        charges,
        trip_cost,
        sub_total,
        discount,
        st_after_discount,
        gst,
        grand_total,
        hsn_sac,
        assigned_to,
        updated_by: user_id,
      };

      // Begin a transaction
      const transaction = await sequelize.transaction();

      try {
        // Update the parent ProformaInvoice record
        const [updated] = await ProformaInvoice.update(proforma_invoice, {
          where: { id },
          transaction,
        });

        if (!updated) {
          await transaction.rollback();
          return status.ResponseStatus(
            res,
            400,
            "Failed to update Proforma invoice"
          );
        }

        // Update `ProformaInvoiceTrips` child table
        const existingTrips = await ProformaInvoiceTrips.findAll({
          where: { pi_id: id },
        });

        // Update or Add trips
        for (const trip of trips) {
          if (trip.id) {
            // Update existing trip
            await ProformaInvoiceTrips.update(trip, {
              where: { id: trip.id },
              transaction,
            });
          } else {
            // Add new trip
            await ProformaInvoiceTrips.create(
              { ...trip, pi_id: id },
              { transaction }
            );
          }
        }

        // Remove trips not included in the update
        const tripIdsToKeep = trips.map((trip) => trip.id).filter(Boolean);
        const tripsToRemove = existingTrips.filter(
          (existingTrip) => !tripIdsToKeep.includes(existingTrip.id)
        );
        for (const trip of tripsToRemove) {
          await ProformaInvoiceTrips.destroy({
            where: { id: trip.id },
            transaction,
          });
        }

        // Update `ProformaInvoiceCharges` child table
        const existingCharges = await ProformaInvoiceCharges.findAll({
          where: { pi_id: id },
        });

        // Update or Add charges
        for (const charge of charges) {
          if (charge.id) {
            // Update existing charge
            await ProformaInvoiceCharges.update(charge, {
              where: { id: charge.id },
              transaction,
            });
          } else {
            // Add new charge
            await ProformaInvoiceCharges.create(
              { ...charge, pi_id: id },
              { transaction }
            );
          }
        }

        // Remove charges not included in the update
        const chargeIdsToKeep = charges
          .map((charge) => charge.id)
          .filter(Boolean);
        const chargesToRemove = existingCharges.filter(
          (existingCharge) => !chargeIdsToKeep.includes(existingCharge.id)
        );
        for (const charge of chargesToRemove) {
          await ProformaInvoiceCharges.destroy({
            where: { id: charge.id },
            transaction,
          });
        }

        // Commit the transaction
        await transaction.commit();

        const pdf = await generatePdf(id);

        await ProformaInvoice.update(
          { file_name: pdf.fileName },
          { where: { id } }
        );

        return status.ResponseStatus(
          res,
          200,
          "Proforma invoice updated successfully"
        );
      } catch (error) {
        // Rollback the transaction in case of any error
        await transaction.rollback();
        console.error("Error updating Proforma invoice:", error.message);
        return status.ResponseStatus(
          res,
          500,
          "Failed to update Proforma invoice",
          error.message
        );
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  // updatePI: async (req, res) => {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return status.ResponseStatus(res, 400, "Validation Failed", errors);
  //     }

  //     const { id } = req.params;
  //     const { user_id } = req.session_data;
  //     const {
  //       aircraft_id,
  //       // type,
  //       // per_hour_cost,
  //       trips,
  //       charges,
  //       // duration,
  //       trip_cost,
  //       sub_total,
  //       discount,
  //       st_after_discount,
  //       gst,
  //       grand_total,
  //       hsn_sac,
  //       assigned_to,
  //     } = req.body;

  //     const proforma_invoice = {
  //       aircraft_id,
  //       // type,
  //       // per_hour_cost,
  //       trips,
  //       charges,
  //       // duration,
  //       trip_cost,
  //       sub_total,
  //       discount,
  //       st_after_discount,
  //       gst,
  //       grand_total,
  //       hsn_sac,
  //       assigned_to,
  //       updated_by: user_id,
  //     };

  //     const result = await ProformaInvoice.update(proforma_invoice, {
  //       where: { id },
  //       include: ["trips", "charges"],
  //     });

  //     if (!result)
  //       return status.ResponseStatus(
  //         res,
  //         400,
  //         "Failed to update proforma invoice"
  //       );

  //     return status.ResponseStatus(
  //       res,
  //       201,
  //       "Proforma invoice updated successfully"
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return status.ResponseStatus(res, 500, "Internal server error", error);
  //   }
  // },
  downloadPI: async (req, res) => {
    try {
      const { id } = req.params;

      const pi = await ProformaInvoice.findByPk(id);
      if (!pi)
        return status.ResponseStatus(res, 404, "Proforma invoice not found");

      const filePath = path.join(
        __dirname,
        "../../../uploads/proforma_invoices",
        pi.file_name
      );

      // Check if file exists
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          return res.status(404).send("File not found");
        }
      });
      // Set headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${pi.file_name}"`
      );

      // Send the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Error downloading file", error);
    }
  },
  deletePIs: async (req, res) => {
    try {
      const { pi_ids = [] } = req.body;

      if (!pi_ids.length) {
        return status.ResponseStatus(
          res,
          400,
          "No Proforma Invoice IDs provided"
        );
      }

      // Fetch existing Proforma Invoices
      const existingProformaInvoices = await ProformaInvoice.findAll({
        where: { id: pi_ids },
        attributes: ["id"],
      });

      const existingIds = existingProformaInvoices.map((invoice) => invoice.id);
      const nonExistingIds = pi_ids.filter((id) => !existingIds.includes(id));

      if (!existingIds.length) {
        return status.ResponseStatus(
          res,
          404,
          "No matching Proforma Invoice(s) found"
        );
      }

      // Begin a transaction
      const transaction = await sequelize.transaction();

      try {
        // Delete child rows from ProformaInvoiceTrips and ProformaInvoiceCharges
        await ProformaInvoiceTrips.destroy({
          where: { pi_id: pi_ids },
          transaction,
        });

        await ProformaInvoiceCharges.destroy({
          where: { pi_id: pi_ids },
          transaction,
        });

        // Delete ProformaInvoice records
        const deletedCount = await ProformaInvoice.destroy({
          where: { id: pi_ids },
          transaction,
        });

        if (deletedCount === 0) {
          await transaction.rollback();
          return status.ResponseStatus(
            res,
            400,
            "No Proforma Invoice(s) deleted"
          );
        }

        // Commit the transaction
        await transaction.commit();
        return status.ResponseStatus(
          res,
          200,
          "Proforma Invoice(s) deleted successfully",
          {
            deleted_ids: existingIds,
            non_existing_ids: nonExistingIds,
          }
        );
      } catch (error) {
        // Rollback the transaction in case of failure
        await transaction.rollback();
        console.error("Error deleting Proforma Invoice(s):", error.message);
        return status.ResponseStatus(
          res,
          500,
          "Failed to delete Proforma Invoice(s)",
          error.message
        );
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
};
