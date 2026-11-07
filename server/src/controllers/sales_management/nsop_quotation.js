const {
  sequelize,
  NSOPQuotation,
  NSOPQuotationTrips,
} = require("../../models");
const status = require("../../helpers/Response");
const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { APP_URL } = process.env;

const generatePdf = async (id) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
      timeout: 60000, // Increase timeout to 60 seconds
    });

    const page = await browser.newPage();

    const website_url = `${APP_URL}/pdf/nsop_quotation/${id}`;

    // Open URL in current page
    await page.goto(website_url, { waitUntil: "networkidle0", timeout: 60000 });
    // await page.screenshot({
    //   path: "quotation.png",
    // });

    // Ensure fonts are loaded
    await page.evaluateHandle("document.fonts.ready");

    //To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");

    // const pdfPath = path.join(__dirname, "output.pdf");
    const uploadsDir = path.join(
      __dirname,
      "../../../uploads/nsop_quotation/pdf"
    );
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `nsop_quotation_${uniqueSuffix}.pdf`;
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
      const maxIdResult = await NSOPQuotation.max("id");
      const nextId = (maxIdResult || 0) + 1;
      const next_number = `SAPL/NQ-${String(nextId).padStart(4, "0")}`;
      res.status(200).json(next_number);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  createQuotation: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }
      const { user_id } = req.session_data;
      let trips = [];
      try {
        trips = JSON.parse(req.body.trips || "[]");
      } catch (e) {
        return status.ResponseStatus(res, 400, "Invalid trips format");
      }
      const {
        customer_name,
        aircraft_name,
        aircraft_pax,
        manufacture_year,
        price,
        // aircraft_image,
        // interior_image,
        // lopa_image,
        // cabin_image,
        type,
        assigned_to,
      } = req.body;

      // console.log(trips);

      const quotation = {
        customer_name,
        aircraft_name,
        aircraft_pax,
        manufacture_year,
        price,
        // aircraft_image: req.uploads.aircraft[0].filename,
        // interior_image: req.uploads.interior[0].filename,
        // lopa_image: req.uploads.lopa[0].filename,
        // cabin_image: req.uploads.cabin[0].filename,
        type,
        assigned_to,
        created_by: user_id,
        updated_by: user_id,
      };

      // Attach images if uploaded
      if (req.uploads.aircraft && req.uploads.aircraft.length > 0) {
        quotation.aircraft_image = req.uploads.aircraft[0].filename;
      }
      if (req.uploads.interior && req.uploads.interior.length > 0) {
        quotation.interior_image = req.uploads.interior[0].filename;
      }
      if (req.uploads.lopa && req.uploads.lopa.length > 0) {
        quotation.lopa_image = req.uploads.lopa[0].filename;
      }
      if (req.uploads.cabin && req.uploads.cabin.length > 0) {
        quotation.cabin_image = req.uploads.cabin[0].filename;
      }

      const result = await NSOPQuotation.create(quotation);

      for (const trip of trips)
        await NSOPQuotationTrips.create({ quotation_id: result.id, ...trip });

      if (!result)
        return status.ResponseStatus(
          res,
          400,
          "Failed to create NSOP Quotation"
        );

      const pdf = await generatePdf(result.id);

      await NSOPQuotation.update(
        { file_name: pdf.fileName },
        { where: { id: result.id } }
      );

      return status.ResponseStatus(
        res,
        201,
        "NSOP Quotation created successfully"
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  listQuotations: async (req, res) => {
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
        { association: "trips" },
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
      const countResult = await NSOPQuotation.count({
        where: whereClause,
        include: includeClause.map((include) => ({
          association: include.association,
          required: include.required,
          where: include.where,
        })),
        distinct: true, // Ensures distinct counting
      });

      // Fetch data with pagination
      const rows = await NSOPQuotation.findAll({
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
        "List of all NSOP Quotations",
        rows,
        info
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  detailQuotation: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await NSOPQuotation.findByPk(id, {
        include: [
          {
            association: "trips",
            include: [
              { association: "departure_airport", include: ["city"] },
              { association: "arrival_airport", include: ["city"] },
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
          `NSOP Quotation not found with id-${id}`
        );

      return status.ResponseStatus(
        res,
        200,
        `Details of NSOP Quotation with id-${id}`,
        result
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  updateQuotation: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { id } = req.params;
      const { user_id } = req.session_data;
      let trips = [];

      try {
        trips = JSON.parse(req.body.trips || "[]");
      } catch (e) {
        return status.ResponseStatus(res, 400, "Invalid trips format");
      }

      const {
        customer_name,
        aircraft_name,
        aircraft_pax,
        manufacture_year,
        price,
        type,
        remove_lopa_image,
        remove_cabin_image,
        assigned_to,
      } = req.body;

      // Build the quotation object
      const quotation = {
        customer_name,
        aircraft_name,
        aircraft_pax,
        manufacture_year,
        price,
        type,
        assigned_to,
        // created_by: user_id,
        updated_by: user_id,
      };

      // Attach images if uploaded
      if (req.uploads.aircraft && req.uploads.aircraft.length > 0) {
        quotation.aircraft_image = req.uploads.aircraft[0].filename;
      }
      if (req.uploads.interior && req.uploads.interior.length > 0) {
        quotation.interior_image = req.uploads.interior[0].filename;
      }
      // if (req.uploads.lopa && req.uploads.lopa.length > 0) {
      //   quotation.lopa_image = req.uploads.lopa[0].filename;
      // }
      // if (req.uploads.cabin && req.uploads.cabin.length > 0) {
      //   quotation.cabin_image = req.uploads.cabin[0].filename;
      // }
      // Attach uploaded images or handle removals
      // if (req.uploads.aircraft && req.uploads.aircraft.length > 0) {
      //   quotation.aircraft_image = req.uploads.aircraft[0].filename;
      // } else if (remove_aircraft_image === "true") {
      //   quotation.aircraft_image = null;
      // }

      // if (req.uploads.interior && req.uploads.interior.length > 0) {
      //   quotation.interior_image = req.uploads.interior[0].filename;
      // } else if (remove_interior_image === "true") {
      //   quotation.interior_image = null;
      // }

      if (req.uploads.lopa && req.uploads.lopa.length > 0) {
        quotation.lopa_image = req.uploads.lopa[0].filename;
      } else if (remove_lopa_image === "true") {
        quotation.lopa_image = null;
      }

      if (req.uploads.cabin && req.uploads.cabin.length > 0) {
        quotation.cabin_image = req.uploads.cabin[0].filename;
      } else if (remove_cabin_image === "true") {
        quotation.cabin_image = null;
      }

      // Start transaction
      const transaction = await sequelize.transaction();

      try {
        // Update parent quotation
        const [updated] = await NSOPQuotation.update(quotation, {
          where: { id },
          transaction,
        });

        if (!updated) {
          await transaction.rollback();
          return status.ResponseStatus(
            res,
            400,
            "Failed to update NSOP Quotation"
          );
        }

        // Update trips
        const existingTrips = await NSOPQuotationTrips.findAll({
          where: { quotation_id: id },
        });

        const tripIdsToKeep = [];

        for (const trip of trips) {
          if (trip.id) {
            // Update existing trip
            await NSOPQuotationTrips.update(trip, {
              where: { id: trip.id },
              transaction,
            });
            tripIdsToKeep.push(trip.id);
          } else {
            // Create new trip
            const newTrip = await NSOPQuotationTrips.create(
              { ...trip, quotation_id: id },
              { transaction }
            );
            tripIdsToKeep.push(newTrip.id);
          }
        }

        // Delete removed trips
        const tripsToRemove = existingTrips.filter(
          (existingTrip) => !tripIdsToKeep.includes(existingTrip.id)
        );

        for (const trip of tripsToRemove) {
          await NSOPQuotationTrips.destroy({
            where: { id: trip.id },
            transaction,
          });
        }

        // Commit transaction
        await transaction.commit();

        // Generate PDF
        const pdf = await generatePdf(id);

        // Update file name in quotation
        await NSOPQuotation.update(
          { file_name: pdf.fileName },
          { where: { id } }
        );

        return status.ResponseStatus(
          res,
          200,
          "NSOP Quotation updated successfully"
        );
      } catch (error) {
        await transaction.rollback();
        console.error("Error updating quotation:", error.message);
        return status.ResponseStatus(
          res,
          500,
          "Failed to update NSOP Quotation",
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
  // updateQuotation: async (req, res) => {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return status.ResponseStatus(res, 400, "Validation Failed", errors);
  //     }
  //     const { id } = req.params;
  //     const { user_id } = req.session_data;
  //     let trips = [];
  //     try {
  //       trips = JSON.parse(req.body.trips || "[]");
  //     } catch (e) {
  //       return status.ResponseStatus(res, 400, "Invalid trips format");
  //     }
  //     const {
  //       customer_name,
  //       aircraft_name,
  //       aircraft_pax,
  //       manufacture_year,
  //       price,
  //       // aircraft_image,
  //       // interior_image,
  //       // lopa_image,
  //       // cabin_image,
  //       type,
  //       assigned_to,
  //     } = req.body;

  //     // console.log(trips);

  //     const quotation = {
  //       customer_name,
  //       aircraft_name,
  //       aircraft_pax,
  //       manufacture_year,
  //       price,
  //       aircraft_image: req.uploads.aircraft[0].filename,
  //       interior_image: req.uploads.interior[0].filename,
  //       lopa_image: req.uploads.lopa[0].filename,
  //       cabin_image: req.uploads.cabin[0].filename,
  //       type,
  //       assigned_to,
  //       created_by: user_id,
  //       updated_by: user_id,
  //     };

  //     // Begin a transaction
  //     const transaction = await sequelize.transaction();

  //     try {
  //       // Update the parent Quotation record
  //       const [updated] = await NSOPQuotation.update(quotation, {
  //         where: { id },
  //         transaction,
  //       });

  //       if (!updated) {
  //         await transaction.rollback();
  //         return status.ResponseStatus(
  //           res,
  //           400,
  //           "Failed to update NSOP Quotation"
  //         );
  //       }

  //       // Update `trips` child table
  //       const existingTrips = await NSOPQuotationTrips.findAll({
  //         where: { quotation_id: id },
  //       });

  //       // Update or Add trips
  //       for (const trip of trips) {
  //         if (trip.id) {
  //           // Update existing trip
  //           await NSOPQuotationTrips.update(trip, {
  //             where: { id: trip.id },
  //             transaction,
  //           });
  //         } else {
  //           // Add new trip
  //           await NSOPQuotationTrips.create(
  //             { ...trip, quotation_id: id },
  //             { transaction }
  //           );
  //         }
  //       }

  //       // Remove trips not included in the update
  //       const tripIdsToKeep = trips.map((trip) => trip.id).filter(Boolean);
  //       const tripsToRemove = existingTrips.filter(
  //         (existingTrip) => !tripIdsToKeep.includes(existingTrip.id)
  //       );
  //       for (const trip of tripsToRemove) {
  //         await NSOPQuotationTrips.destroy({
  //           where: { id: trip.id },
  //           transaction,
  //         });
  //       }

  //       // Commit the transaction
  //       await transaction.commit();

  //       const pdf = await generatePdf(id);

  //       await NSOPQuotation.update(
  //         { file_name: pdf.fileName },
  //         { where: { id } }
  //       );

  //       return status.ResponseStatus(
  //         res,
  //         200,
  //         "NSOP Quotation updated successfully"
  //       );
  //     } catch (error) {
  //       // Rollback the transaction in case of any error
  //       await transaction.rollback();
  //       console.error("Error updating quotation:", error.message);
  //       return status.ResponseStatus(
  //         res,
  //         500,
  //         "Failed to update NSOP Quotation",
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
  downloadQuotation: async (req, res) => {
    try {
      const { id } = req.params;

      const quotes = await NSOPQuotation.findByPk(id);
      if (!quotes)
        return status.ResponseStatus(res, 404, "Quotation not found");

      const filePath = path.join(
        __dirname,
        "../../../uploads/nsop_quotation/pdf",
        quotes.file_name
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
        `attachment; filename="${quotes.file_name}"`
      );

      // Send the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Error downloading file", error);
    }
  },
  deleteQuotations: async (req, res) => {
    try {
      const { quote_ids = [] } = req.body;

      if (!quote_ids.length) {
        return status.ResponseStatus(res, 400, "No Quotation IDs provided");
      }

      // Fetch existing Quotations
      const existingQuotations = await NSOPQuotation.findAll({
        where: { id: quote_ids },
        attributes: ["id"],
      });

      const existingIds = existingQuotations.map((quote) => quote.id);
      const nonExistingIds = quote_ids.filter(
        (id) => !existingIds.includes(id)
      );

      if (!existingIds.length) {
        return status.ResponseStatus(
          res,
          404,
          "No matching Quotation(s) found"
        );
      }

      // Begin a transaction
      const transaction = await sequelize.transaction();

      try {
        // Delete child rows from QuotationTrips and QuotationCharges
        await NSOPQuotationTrips.destroy({
          where: { quotation_id: quote_ids },
          transaction,
        });

        // Delete Quotation records
        const deletedCount = await NSOPQuotation.destroy({
          where: { id: quote_ids },
          transaction,
        });

        if (deletedCount === 0) {
          await transaction.rollback();
          return status.ResponseStatus(res, 400, "No Quotation(s) deleted");
        }

        // Commit the transaction
        await transaction.commit();
        return status.ResponseStatus(
          res,
          200,
          "Quotation(s) deleted successfully",
          {
            deleted_ids: existingIds,
            non_existing_ids: nonExistingIds,
          }
        );
      } catch (error) {
        // Rollback the transaction in case of failure
        await transaction.rollback();
        console.error("Error deleting Quotation(s):", error.message);
        return status.ResponseStatus(
          res,
          500,
          "Failed to delete Quotation(s)",
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
