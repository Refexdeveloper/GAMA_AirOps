const {
  sequelize,
  BriefSheet,
  BriefSheetTrips,
  BriefSheetTripPassengers,
  BriefSheetTripCrew,
  BriefSheetTripPassengerFacilitators,
  
} = require("../../models");
const status = require("../../helpers/Response");
const PDFDocument = require("pdfkit");

const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");
const { validationResult } = require("express-validator");
const { Op, where } = require("sequelize");
const { APP_URL } = process.env;

// const generatePdf = async (id) => {
//   let browser;
//   try {
//     browser = await puppeteer.launch({
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       headless: true,
//       timeout: 60000, // Increase timeout to 60 seconds
//     });

//     const page = await browser.newPage();

//     // // Set the authorization header
//     // await page.setExtraHTTPHeaders({
//     //   Authorization: `Bearer ${token}`,
//     // });

//     // await page.setContent(
//     //   `
//     //   <!DOCTYPE html>
//     //   <html lang="en">
//     //   <head>
//     //     <meta charset="UTF-8">
//     //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     //     <title>PDF Example</title>
//     //     <style>
//     //       body {
//     //         font-family: Arial, sans-serif;
//     //         margin: 0;
//     //         padding: 0;
//     //       }
//     //       .container {
//     //         width: 210mm; /* A4 width */
//     //         height: 297mm; /* A4 height */
//     //         padding: 20mm;
//     //         box-sizing: border-box;
//     //       }
//     //       h1 {
//     //         text-align: center;
//     //       }
//     //     </style>
//     //   </head>
//     //   <body>
//     //     <div class="container">
//     //       <h1>This is an A4 sized PDF</h1>
//     //       <p>This PDF is generated using Puppeteer. You can customize the content as needed.</p>
//     //     </div>
//     //   </body>
//     //   </html>
//     // `,
//     //   {
//     //     waitUntil: "networkidle0", // Wait until the network is idle
//     //   }
//     // );

//     // Website URL to export as pdf
//     const website_url = `${APP_URL}/pdf/brief_sheet/${}`;

//     // Open URL in current page
//     await page.goto(website_url, { waitUntil: "networkidle0" });

//     //To reflect CSS used for screens instead of print
//     await page.emulateMediaType("screen");

//     const pdfPath = path.join(__dirname, "output.pdf");
//     await page.pdf({
//       path: pdfPath,
//       format: "A4",
//       printBackground: true,
//     });

//     return pdfPath;
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     throw error;
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// };
const generatePdf = async (id) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
      timeout: 60000, // Increase timeout to 60 seconds
    });

    const page = await browser.newPage();

    // await page.setViewport({ width: 1920, height: 1080 });

    // // Set the authorization header
    // await page.setExtraHTTPHeaders({
    //   Authorization: `Bearer ${token}`,
    // });

    // await page.setContent(
    //   `
    //   <!DOCTYPE html>
    //   <html lang="en">
    //   <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>PDF Example</title>
    //     <style>
    //       body {
    //         font-family: Arial, sans-serif;
    //         margin: 0;
    //         padding: 0;
    //       }
    //       .container {
    //         width: 210mm; /* A4 width */
    //         height: 297mm; /* A4 height */
    //         padding: 20mm;
    //         box-sizing: border-box;
    //       }
    //       h1 {
    //         text-align: center;
    //       }
    //     </style>
    //   </head>
    //   <body>
    //     <div class="container">
    //       <h1>This is an A4 sized PDF</h1>
    //       <p>This PDF is generated using Puppeteer. You can customize the content as needed.</p>
    //     </div>
    //   </body>
    //   </html>
    // `,
    //   {
    //     waitUntil: "networkidle0", // Wait until the network is idle
    //   }
    // );

    // Website URL to export as pdf
    const website_url = `${APP_URL}/pdf/brief_sheet/${id}`;

    // Open URL in current page
    await page.goto(website_url, { waitUntil: "networkidle0", timeout: 60000 });
    // await page.screenshot({
    //   path: "brief_sheet.png",
    // });

    // Ensure fonts are loaded
    await page.evaluateHandle("document.fonts.ready");

    //To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");

    // const pdfPath = path.join(__dirname, "output.pdf");
    const uploadsDir = path.join(__dirname, "../../../uploads/brief_sheets");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `flight_brief_sheet_${uniqueSuffix}.pdf`;
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

// const handlePassengers = async (tripId, passengers, transaction) => {
//   const existingPassengers = await BriefSheetTripPassengers.findAll({
//     where: { trip_id: tripId },
//     transaction,
//   });

//   const existingPassengerIds = existingPassengers.map((p) => p.id);

//   // Update or Add passengers
//   for (const passenger of passengers) {
//     if (passenger.id) {
//       // Update existing passenger
//       await BriefSheetTripPassengers.update(passenger, {
//         where: { id: passenger.id, trip_id: tripId },
//         transaction,
//       });
//     } else {
//       // Add new passenger
//       await BriefSheetTripPassengers.create(
//         { ...passenger, trip_id: tripId },
//         { transaction }
//       );
//     }
//   }

//   // Remove passengers not included in the update
//   const passengerIdsToKeep = passengers.map((p) => p.id).filter(Boolean);
//   const passengersToRemove = existingPassengerIds.filter(
//     (id) => !passengerIdsToKeep.includes(id)
//   );

//   await BriefSheetTripPassengers.destroy({
//     where: { id: passengersToRemove },
//     transaction,
//   });
// };


const handlePassengers = async (tripId, passengers, transaction) => {
  const existingPassengers = await BriefSheetTripPassengers.findAll({
    where: { trip_id: tripId },
    transaction,
  });

  const existingPassengerIds = existingPassengers.map((p) => p.id);

  // Update or Add passengers
  for (let i = 0; i < passengers.length; i++) {
    const passenger = { ...passengers[i], _order: i }; // ensure _order is set

    if (passenger.id) {
      await BriefSheetTripPassengers.update(passenger, {
        where: { id: passenger.id, trip_id: tripId },
        transaction,
      });
    } else {
      await BriefSheetTripPassengers.create(
        { ...passenger, trip_id: tripId },
        { transaction }
      );
    }
  }

  // Remove passengers not included in the update
  const passengerIdsToKeep = passengers.map((p) => p.id).filter(Boolean);
  const passengersToRemove = existingPassengerIds.filter(
    (id) => !passengerIdsToKeep.includes(id)
  );

  await BriefSheetTripPassengers.destroy({
    where: { id: passengersToRemove },
    transaction,
  });
};

const handleCrew = async (tripId, crew, transaction) => {
  const existingCrew = await BriefSheetTripCrew.findAll({
    where: { trip_id: tripId },
    transaction,
  });

  const existingCrewIds = existingCrew.map((c) => c.id);

  // Update or Add crew members
  for (let i = 0; i < crew.length; i++) {
    const crewMember = { ...crew[i], _order: i }; // always assign order

    if (crewMember.id) {
      // Update existing crew member
      await BriefSheetTripCrew.update(crewMember, {
        where: { id: crewMember.id, trip_id: tripId },
        transaction,
      });
    } else {
      // Add new crew member
      await BriefSheetTripCrew.create(
        { ...crewMember, trip_id: tripId },
        { transaction }
      );
    }
  }

  // Remove crew members not included in the update
  const crewIdsToKeep = crew.map((c) => c.id).filter(Boolean);
  const crewToRemove = existingCrewIds.filter(
    (id) => !crewIdsToKeep.includes(id)
  );

  if (crewToRemove.length > 0) {
    await BriefSheetTripCrew.destroy({
      where: { id: crewToRemove },
      transaction,
    });
  }
};

const handlePassengerFacilitators = async (tripId, facilitators, transaction) => {
  const existing = await BriefSheetTripPassengerFacilitators.findAll({
    where: { trip_id: tripId },
    transaction,
  });

  const existingIds = existing.map((f) => f.id);

  for (let i = 0; i < facilitators.length; i++) {
    const facilitator = { ...facilitators[i], _order: i };
    if (facilitator.id) {
      await BriefSheetTripPassengerFacilitators.update(facilitator, {
        where: { id: facilitator.id, trip_id: tripId },
        transaction,
      });
    } else {
      await BriefSheetTripPassengerFacilitators.create(
        { ...facilitator, trip_id: tripId },
        { transaction }
      );
    }
  }

  const idsToKeep = facilitators.map((f) => f.id).filter(Boolean);
  const toRemove = existingIds.filter((id) => !idsToKeep.includes(id));

  if (toRemove.length > 0) {
    await BriefSheetTripPassengerFacilitators.destroy({
      where: { id: toRemove },
      transaction,
    });
  }
};

module.exports = {
  getNextNumber: async (req, res) => {
    try {
      const maxIdResult = await BriefSheet.max("id");
      const nextId = (maxIdResult || 0) + 1;
      const next_number = `SAPL/FBS-${String(nextId).padStart(4, "0")}`;
      res.status(200).json(next_number);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  // creatBriefSheet: async (req, res) => {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return status.ResponseStatus(res, 400, "Validation Failed", errors);
  //     }
  //     const { user_id } = req.session_data;

  //     const {
  //       customer_name,
  //       aircraft_id,
  //       flight_manager,
  //       flight_manager_phone,
  //       operation_manager,
  //       operation_manager_phone,
  //       trips = [],
  //     } = req.body;

  //     const briefSheet = {
  //       customer_name,
  //       aircraft_id,
  //       flight_manager,
  //       flight_manager_phone,
  //       operation_manager,
  //       operation_manager_phone,
  //       trips,
  //       created_by: user_id,
  //       updated_by: user_id,
  //     };

  //     const result = await BriefSheet.create(briefSheet, {
  //       include: [{ association: "trips", include: ["passengers", "crew"] }],
  //     });

  //     if (!result)
  //       return status.ResponseStatus(res, 400, "Failed to create brief sheet");

  //     const doc = new PDFDocument({
  //       size: "A4", // Set A4 paper size
  //       margin: 0, // No margins
  //     });

  //     // Define the path to save the PDF
  //     const uploadsDir = path.join(__dirname, "../../../uploads/brief_sheets");
  //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  //     const fileName = `flight_brief_sheet_${uniqueSuffix}.pdf`;
  //     const filePath = path.join(uploadsDir, fileName);
  //     // Ensure the uploads directory exists
  //     if (!fs.existsSync(uploadsDir)) {
  //       fs.mkdirSync(uploadsDir);
  //     }
  //     // Create a write stream to the file
  //     const writeStream = fs.createWriteStream(filePath);

  //     // Pipe the PDF document to the write stream
  //     doc.pipe(writeStream);

  //     doc.fontSize(8);
  //     doc.text(`Customer Name: ${result.customer_name}`, {
  //       width: 410,
  //       align: "left",
  //     });

  //     doc.end();

  //     await BriefSheet.update(
  //       { file_name: fileName },
  //       { where: { id: result.id } }
  //     );

  //     return status.ResponseStatus(
  //       res,
  //       201,
  //       "Brief Sheet created successfully"
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return status.ResponseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  creatBriefSheet: async (req, res) => {
    let browser;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }
      const { user_id } = req.session_data;

      const {
        customer_name,
        aircraft_id,
        flight_manager,
        flight_manager_phone,
        operation_manager,
        operation_manager_phone,
        trips = [],
      } = req.body;

      const briefSheet = {
        customer_name,
        aircraft_id,
        flight_manager,
        flight_manager_phone,
        operation_manager,
        operation_manager_phone,
        trips: trips.map((trip) => ({
          ...trip,
          passengers:
            trip.passengers?.map((p, i) => ({ ...p, _order: i })) || [],
          crew: trip.crew?.map((c, i) => ({ ...c, _order: i })) || [],
          passenger_facilitators:
            trip.passenger_facilitators?.map((f, i) => ({ ...f, _order: i })) ||
            [],
        })),
        created_by: user_id,
        updated_by: user_id,
      };

      const result = await BriefSheet.create(briefSheet, {
        include: [
          {
            association: "trips",
            include: ["passengers", "crew", "passenger_facilitators"],
          },
        ],
      });

      if (!result)
        return status.ResponseStatus(res, 400, "Failed to create brief sheet");

      const pdf = await generatePdf(result.id);

      await BriefSheet.update(
        { file_name: pdf.fileName },
        { where: { id: result.id } }
      );

      return status.ResponseStatus(
        res,
        201,
        "Brief Sheet created successfully"
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  },
  listBriefSheets: async (req, res) => {
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
        { association: "aircraft", include: ["model"] },
        { association: "trips" },
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
      const countResult = await BriefSheet.count({
        where: whereClause,
        include: includeClause.map((include) => ({
          association: include.association,
          required: include.required,
          where: include.where,
        })),
        distinct: true, // Ensures distinct counting
      });

      // Fetch data with pagination
      const rows = await BriefSheet.findAll({
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
        "List of all brief sheets",
        rows,
        info
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  detailBriefSheet: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await BriefSheet.findByPk(id, {
        include: [
          {
            association: "aircraft",
            include: { association: "model", include: ["images"] },
          },
          {
            association: "trips",
            include: [
              {
                association: "departure_airport",
                include: {
                  association: "city",
                  include: [
                    { association: "zone" },
                    { association: "country" },
                  ],
                },
              },
              {
                association: "arrival_airport",
                include: {
                  association: "city",
                  include: [
                    { association: "zone" },
                    { association: "country" },
                  ],
                },
              },
              { association: "passengers",   order: [["_order", "ASC"]], },
              { association: "crew", order: [["_order", "ASC"]], },
              { association: "passenger_facilitators", order: [["_order", "ASC"]] },
            ],
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
          `Brief Sheet not found with id-${id}`
        );

        if (result?.trips?.length) {
  result.trips.forEach((trip) => {
    if (trip.passengers?.length) {
      trip.passengers.sort((a, b) => a._order - b._order);
    }
    if (trip.crew?.length) {
      trip.crew.sort((a, b) => a._order - b._order);
    }
    if (trip.passenger_facilitators?.length) {
      trip.passenger_facilitators.sort((a, b) => a._order - b._order);
    }
  });
}

      return status.ResponseStatus(
        res,
        200,
        `Details of brief sheet with id-${id}`,
        result
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  updateBriefSheet: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { id } = req.params; // BriefSheet ID
      const { user_id } = req.session_data;
      const {
        customer_name,
        aircraft_id,
        flight_manager,
        flight_manager_phone,
        operation_manager,
        operation_manager_phone,
        trips = [], // Array of trips with passengers and crew
      } = req.body;

      const briefSheet = {
        customer_name,
        aircraft_id,
        flight_manager,
        flight_manager_phone,
        operation_manager,
        operation_manager_phone,
        updated_by: user_id,
      };

      // Begin a transaction
      const transaction = await sequelize.transaction();

      try {
        // Update the parent BriefSheet record
        const [updated] = await BriefSheet.update(briefSheet, {
          where: { id },
          transaction,
        });

        if (!updated) {
          await transaction.rollback();
          return status.ResponseStatus(
            res,
            400,
            "Failed to update Brief Sheet"
          );
        }

        // Fetch existing trips for the BriefSheet
        const existingTrips = await BriefSheetTrips.findAll({
          where: { sheet_id: id },
          transaction,
        });
        const existingTripIds = existingTrips.map((trip) => trip.id);

        // Update or Add trips
        for (const trip of trips) {
          const { id: tripId, passengers = [], crew = [], passenger_facilitators = [] } = trip;

          if (tripId) {
            // Update existing trip
            await BriefSheetTrips.update(trip, {
              where: { id: tripId },
              transaction,
            });
          } else {
            // Add new trip
            const newTrip = await BriefSheetTrips.create(
              { ...trip, sheet_id: id },
              { transaction }
            );
            trip.id = newTrip.id; // Add the new ID for further processing
          }
          trip.passengers = passengers?.map((p, i) => ({ ...p, _order: i })) || [];
          trip.crew = crew?.map((c, i) => ({ ...c, _order: i })) || [];
          trip.passenger_facilitators =
            passenger_facilitators?.map((f, i) => ({ ...f, _order: i })) || [];
 

          // Handle passengers for the trip
          await handlePassengers(trip.id, passengers, transaction);

          // Handle crew for the trip
          await handleCrew(trip.id, crew, transaction);

          // Handle passenger facilitators for the trip
          await handlePassengerFacilitators(trip.id, passenger_facilitators, transaction);
        }

        // Remove trips (and related passengers/crew) not included in the update
        const tripIdsToKeep = trips.map((trip) => trip.id).filter(Boolean);
        const tripsToRemove = existingTripIds.filter(
          (existingTripId) => !tripIdsToKeep.includes(existingTripId)
        );

        for (const tripId of tripsToRemove) {
          // First, delete related passengers and crew
          await BriefSheetTripPassengers.destroy({
            where: { trip_id: tripId },
            transaction,
          });
          await BriefSheetTripCrew.destroy({
            where: { trip_id: tripId },
            transaction,
          });
          await BriefSheetTripPassengerFacilitators.destroy({
            where: { trip_id: tripId },
            transaction,
          });

          // Then, delete the trip
          await BriefSheetTrips.destroy({
            where: { id: tripId },
            transaction,
          });
        }

        // Commit the transaction
        await transaction.commit();

        // Generate the PDF (if applicable)
        const pdf = await generatePdf(id);

        await BriefSheet.update({ file_name: pdf.fileName }, { where: { id } });

        return status.ResponseStatus(
          res,
          200,
          "Brief Sheet updated successfully"
        );
      } catch (error) {
        // Rollback the transaction in case of any error
        await transaction.rollback();
        console.error("Error updating Brief Sheet:", error.message);
        return status.ResponseStatus(
          res,
          500,
          "Failed to update Brief Sheet",
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

  // updateBriefSheet: async (req, res) => {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return status.ResponseStatus(res, 400, "Validation Failed", errors);
  //     }

  //     const { id } = req.params; // BriefSheet ID
  //     const { user_id } = req.session_data; // User performing the update
  //     const {
  //       customer_name,
  //       aircraft_id,
  //       flight_manager,
  //       flight_manager_phone,
  //       operation_manager,
  //       operation_manager_phone,
  //       trips = [],
  //     } = req.body;

  //     const briefSheet = {
  //       customer_name,
  //       aircraft_id,
  //       flight_manager,
  //       flight_manager_phone,
  //       operation_manager,
  //       operation_manager_phone,
  //       updated_by: user_id,
  //     };

  //     // Begin a transaction
  //     const transaction = await sequelize.transaction();

  //     try {
  //       // Update the main BriefSheet record
  //       const [updated] = await BriefSheet.update(briefSheet, {
  //         where: { id },
  //         transaction,
  //       });

  //       if (!updated) {
  //         await transaction.rollback();
  //         return status.ResponseStatus(
  //           res,
  //           400,
  //           "Failed to update Brief Sheet"
  //         );
  //       }

  //       // Fetch existing trips related to the BriefSheet
  //       const existingTrips = await BriefSheetTrips.findAll({
  //         where: { sheet_id: id },
  //         transaction,
  //       });

  //       const existingTripIds = existingTrips.map((trip) => trip.id); // Extract existing trip IDs
  //       const tripIdsToKeep = []; // To track trip IDs that should remain

  //       // Process trips
  //       for (const trip of trips) {
  //         const { id: tripId, passengers = [], crew = [] } = trip;

  //         let effectiveTripId; // Variable to hold the valid trip ID (existing or new)

  //         if (tripId) {
  //           // Update existing trip
  //           await BriefSheetTrips.update(trip, {
  //             where: { id: tripId },
  //             transaction,
  //           });
  //           effectiveTripId = tripId;
  //         } else {
  //           // Add new trip
  //           const newTrip = await BriefSheetTrips.create(
  //             { ...trip, sheet_id: id },
  //             { transaction }
  //           );
  //           effectiveTripId = newTrip.id;
  //         }

  //         tripIdsToKeep.push(effectiveTripId); // Mark this trip as one to keep

  //         // Handle passengers
  //         await handlePassengers(effectiveTripId, passengers, transaction);

  //         // Handle crew
  //         await handleCrew(effectiveTripId, crew, transaction);
  //       }

  //       // Remove trips (and related passengers/crew) not included in the update
  //       const tripsToRemove = existingTripIds.filter(
  //         (existingTripId) => !tripIdsToKeep.includes(existingTripId)
  //       );

  //       for (const tripId of tripsToRemove) {
  //         // Delete trips
  //         await BriefSheetTrips.destroy({
  //           where: { id: tripId },
  //           transaction,
  //         });

  //         // Remove related passengers and crew
  //         await BriefSheetTripPassengers.destroy({
  //           where: { trip_id: tripId },
  //           transaction,
  //         });
  //         await BriefSheetTripCrew.destroy({
  //           where: { trip_id: tripId },
  //           transaction,
  //         });
  //       }

  //       // Commit the transaction
  //       await transaction.commit();

  //       // Generate the updated PDF
  //       const pdf = await generatePdf(id);

  //       // Update the file name in the database
  //       await BriefSheet.update({ file_name: pdf.fileName }, { where: { id } });

  //       return status.ResponseStatus(
  //         res,
  //         200,
  //         "Brief Sheet updated successfully"
  //       );
  //     } catch (error) {
  //       // Rollback the transaction in case of any error
  //       await transaction.rollback();
  //       console.error("Error updating Brief Sheet:", error.message);
  //       return status.ResponseStatus(
  //         res,
  //         500,
  //         "Failed to update Brief Sheet",
  //         error.message
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error:", error.message);
  //     return status.ResponseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  downloadBriefSheet: async (req, res) => {
    try {
      const { id } = req.params;

      const sheet = await BriefSheet.findByPk(id);
      if (!sheet)
        return status.ResponseStatus(res, 404, "Brief Sheet not found");

      const filePath = path.join(
        __dirname,
        "../../../uploads/brief_sheets",
        sheet.file_name
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
        `attachment; filename="${sheet.file_name}"`
      );

      // Send the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Error downloading file", error);
    }
  },
  deleteBriefSheets: async (req, res) => {
    try {
      const { sheet_ids = [] } = req.body;

      if (!sheet_ids.length) {
        return status.ResponseStatus(res, 400, "No BriefSheet IDs provided");
      }

      // Fetch existing BriefSheets
      const existingBriefSheets = await BriefSheet.findAll({
        where: { id: sheet_ids },
        include: {
          model: BriefSheetTrips,
          as: "trips",
          attributes: ["id"], // We need the trip ids for the child tables
        },
        attributes: ["id"],
      });

      const existingIds = existingBriefSheets.map(
        (briefSheet) => briefSheet.id
      );
      const nonExistingIds = sheet_ids.filter(
        (id) => !existingIds.includes(id)
      );

      if (!existingIds.length) {
        return status.ResponseStatus(
          res,
          404,
          "No matching BriefSheet(s) found"
        );
      }

      // Begin a transaction
      const transaction = await sequelize.transaction();

      try {
        // Get the trip_ids associated with the existing BriefSheets
        const tripIds = existingBriefSheets.flatMap(
          (briefSheet) =>
            briefSheet.trips ? briefSheet.trips.map((trip) => trip.id) : [] // Ensure `trips` exists before calling `map`
        );

        if (tripIds.length === 0) {
          return status.ResponseStatus(
            res,
            400,
            "No trips associated with the BriefSheet(s)"
          );
        }

        // Delete passengers and crew for each trip
        await BriefSheetTripPassengers.destroy({
          where: { trip_id: tripIds },
          transaction,
        });

        await BriefSheetTripCrew.destroy({
          where: { trip_id: tripIds },
          transaction,
        });

        await BriefSheetTripPassengerFacilitators.destroy({
          where: { trip_id: tripIds },
          transaction,
        });

        // Delete all trips associated with the BriefSheet
        await BriefSheetTrips.destroy({
          where: { sheet_id: sheet_ids },
          transaction,
        });

        // Finally, delete the BriefSheet itself
        const deletedCount = await BriefSheet.destroy({
          where: { id: sheet_ids },
          transaction,
        });

        if (deletedCount === 0) {
          await transaction.rollback();
          return status.ResponseStatus(res, 400, "No BriefSheet(s) deleted");
        }

        // Commit the transaction
        await transaction.commit();
        return status.ResponseStatus(
          res,
          200,
          "BriefSheet(s) deleted successfully",
          {
            deleted_ids: existingIds,
            non_existing_ids: nonExistingIds,
          }
        );
      } catch (error) {
        // Rollback the transaction in case of failure
        await transaction.rollback();
        console.error("Error deleting BriefSheet(s):", error.message);
        return status.ResponseStatus(
          res,
          500,
          "Failed to delete BriefSheet(s)",
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
