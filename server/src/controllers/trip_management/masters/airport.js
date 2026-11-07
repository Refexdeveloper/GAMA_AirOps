const { MastersAirport, sequelize } = require("../../../models");
const { Op } = require("sequelize");
const status = require("../../../helpers/Response");
const { validationResult } = require("express-validator");

module.exports = {
  getAllAirports: async (req, res) => {
    try {
      const result = await MastersAirport.findAll({ include: "city" });
      if (result.length) {
        let list = [];
        result.map((airport) => {
          const {
            id,
            airport_name,
            iata_code,
            icao_code,
            city_id,
            city,
            latitude,
            longitude,
            address,
            remark,
            critical_airport,
            airport_handling_charge,
            ground_handling_charge,
            alertable_airport,
            created_by,
            updated_by,
            createdAt,
            updatedAt,
          } = airport;
          list.push({
            airport_id: id,
            airport_name: `${city.city_name}(${icao_code}), ${airport_name}`,
            airport_city: city.city_name,
            coordinates: [latitude, longitude],
            airport_handling_charge,
            ground_handling_charge,
            critical_airport,
          });
        });
        return res.status(200).json(list);
      }
      return status.ResponseStatus(res, 404, "No data");
    } catch (error) {
      console.log(error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  listAirports: async (req, res) => {
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
        { association: "city", include: ["country"] },
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
      const countResult = await MastersAirport.count({
        where: whereClause,
        include: includeClause.map((include) => ({
          association: include.association,
          required: include.required,
          where: include.where,
        })),
        distinct: true, // Ensures distinct counting
      });

      // Fetch data with pagination
      const rows = await MastersAirport.findAll({
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
        "List of all airports",
        rows,
        info
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  createAirport: async (req, res) => {
    try {
      // Validate the incoming request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { user_id } = req.session_data; // Extract user ID from session

      const {
        airport_name,
        iata_code,
        icao_code,
        city_id,
        country_id,
        latitude = null,
        longitude = null,
        airport_handling_charge,
        ground_handling_charge,
        address = null,
        remark = null,
        critical_airport = null,
        alertable_airport = null,
      } = req.body;

      // Create the new airport object
      const newAirport = {
        airport_name,
        iata_code,
        icao_code,
        city_id,
        country_id,
        latitude,
        longitude,
        airport_handling_charge,
        ground_handling_charge,
        address,
        remark,
        critical_airport,
        alertable_airport,
        created_by: user_id,
        updated_by: user_id,
      };

      // Insert the new airport record
      const result = await MastersAirport.create(newAirport);

      if (!result) {
        return status.ResponseStatus(res, 400, "Failed to create airport");
      }

      return status.ResponseStatus(
        res,
        201,
        "Airport created successfully",
        result
      );
    } catch (error) {
      console.error("Error creating airport:", error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  updateAirport: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { id } = req.params; // Airport ID
      const { user_id } = req.session_data;
      const {
        airport_name,
        iata_code,
        country_id,
        icao_code,
        city_id,
        latitude = null,
        longitude = null,
        airport_handling_charge,
        ground_handling_charge,
        address = null,
        remark = null,
        critical_airport = null,
        alertable_airport = null,
      } = req.body;

      const updatedAirport = {
        airport_name,
        iata_code,
        icao_code,
        city_id,
        country_id,
        latitude,
        longitude,
        airport_handling_charge,
        ground_handling_charge,
        address,
        remark,
        critical_airport,
        alertable_airport,
        updated_by: user_id,
      };

      // Begin a transaction
      const transaction = await sequelize.transaction();

      try {
        // Update the airport record
        const [updated] = await MastersAirport.update(updatedAirport, {
          where: { id },
          transaction,
        });

        if (!updated) {
          await transaction.rollback();
          return status.ResponseStatus(res, 400, "Failed to update airport");
        }

        // Commit the transaction
        await transaction.commit();

        return status.ResponseStatus(
          res,
          200,
          "Airport updated successfully",
          updatedAirport
        );
      } catch (error) {
        // Rollback the transaction in case of any error
        await transaction.rollback();
        console.error("Error updating airport:", error.message);
        return status.ResponseStatus(res, 500, "Failed to update airport", {
          error: error.message,
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  detailAirport: async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch the airport details with all necessary associations
      const result = await MastersAirport.findByPk(id, {
        include: [
          {
            association: "city",
            attributes: ["id", "city_name"],
            include: { association: "country" },
          },
          {
            association: "creator",
            attributes: ["id", "full_name", "email", "role"],
          },
          {
            association: "updater",
            attributes: ["id", "full_name", "email", "role"],
          },
        ],
      });

      // Check if the airport exists
      if (!result)
        return status.ResponseStatus(
          res,
          404,
          `Airport not found with id-${id}`
        );

      // Return the airport details
      return status.ResponseStatus(
        res,
        200,
        `Details of airport with id-${id}`,
        result
      );
    } catch (error) {
      console.error("Error fetching airport details:", error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  deleteAirports: async (req, res) => {
    try {
      const { airport_ids = [] } = req.body;

      if (!airport_ids.length) {
        return status.ResponseStatus(res, 400, "No Airport IDs provided");
      }

      // Fetch existing Airports
      const existingAirports = await MastersAirport.findAll({
        where: { id: airport_ids },
        attributes: ["id"],
      });

      const existingIds = existingAirports.map((airport) => airport.id);
      const nonExistingIds = airport_ids.filter(
        (id) => !existingIds.includes(id)
      );

      if (!existingIds.length) {
        return status.ResponseStatus(res, 404, "No matching Airport(s) found");
      }

      // Start a transaction
      const transaction = await sequelize.transaction();

      try {
        // Delete the Airports within the transaction
        const deletedCount = await MastersAirport.destroy({
          where: { id: airport_ids },
          transaction,
        });

        if (deletedCount === 0) {
          await transaction.rollback();
          return status.ResponseStatus(res, 400, "No Airport(s) deleted");
        }

        // Commit the transaction
        await transaction.commit();

        return status.ResponseStatus(
          res,
          200,
          "Airport(s) deleted successfully",
          {
            deleted_ids: existingIds,
            non_existing_ids: nonExistingIds,
          }
        );
      } catch (error) {
        // Rollback the transaction in case of failure
        await transaction.rollback();
        console.error("Error deleting Airport(s):", error.message);
        return status.ResponseStatus(
          res,
          500,
          "Failed to delete Airport(s)",
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
