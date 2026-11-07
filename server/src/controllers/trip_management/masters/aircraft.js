const { MastersAircraft, sequelize } = require("../../../models");
const { Op, where } = require("sequelize");
const status = require("../../../helpers/Response");
const { validationResult } = require("express-validator");

module.exports = {
  getAllAircrafts: async (req, res) => {
    try {
      const result = await MastersAircraft.findAll({ include: ["model"] });
      if (!result) return status.ResponseStatus(res, 404, "No data available");
      return status.ResponseStatus(res, 200, "All Aircrafts", result);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  listAircrafts: async (req, res) => {
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
        { association: "operator" },
        { association: "model" },
        { association: "last_arrival_airport" },
        { association: "creator" },
        { association: "updater" },
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

      const { count, rows } = await MastersAircraft.findAndCountAll({
        where: whereClause,
        include: includeClause,
        order: [[sort, order]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);

      const info = {
        total_items: count,
        total_pages: totalPages,
        current_page: parseInt(page),
      };
      if (!count) return status.ResponseStatus(res, 404, "No data available");
      return status.ResponseStatus(
        res,
        200,
        "List of all aircrafts",
        rows,
        info
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  createAircraft: async (req, res) => {
    try {
      // Validate the incoming request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { user_id } = req.session_data; // Extract user ID from session

      const {
        operator_id,
        model_id,
        reg_no,
        min_cabin_crew = null,
        min_flight_crew,
        no_of_captain = null,
        no_of_fo = null,
        no_of_fe = null,
        c_cls_capacity = null,
        y_cls_capacity = null,
        seating_capacity = null,
        cruising_speed = null,
        time_format,
        local_time = false,
        utc_time = false,
        block_opening_hrs = null,
        time_in_air_opening_hrs = null,
        not_in_service = false,
        not_in_service_from = null,
        freight_capacity = null,
        unit = null,
        last_arrival = null,
      } = req.body;

      // Create the new aircraft object
      const newAircraft = {
        operator_id,
        model_id,
        reg_no,
        min_cabin_crew,
        min_flight_crew,
        no_of_captain,
        no_of_fo,
        no_of_fe,
        c_cls_capacity,
        y_cls_capacity,
        seating_capacity,
        cruising_speed,
        time_format,
        local_time,
        utc_time,
        block_opening_hrs,
        time_in_air_opening_hrs,
        not_in_service,
        not_in_service_from,
        freight_capacity,
        unit,
        last_arrival,
        created_by: user_id,
        updated_by: user_id,
      };

      // Insert the new aircraft record
      const result = await MastersAircraft.create(newAircraft);

      if (!result) {
        return status.ResponseStatus(res, 400, "Failed to create aircraft");
      }

      return status.ResponseStatus(
        res,
        201,
        "Aircraft created successfully",
        result
      );
    } catch (error) {
      console.error("Error creating aircraft:", error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  updateAircraft: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { id } = req.params; // Aircraft ID
      const { user_id } = req.session_data;
      const {
        operator_id,
        model_id,
        reg_no,
        min_cabin_crew = null,
        min_flight_crew,
        no_of_captain = null,
        no_of_fo = null,
        no_of_fe = null,
        c_cls_capacity = null,
        y_cls_capacity = null,
        seating_capacity = null,
        cruising_speed = null,
        time_format,
        local_time = false,
        utc_time = false,
        block_opening_hrs = null,
        time_in_air_opening_hrs = null,
        not_in_service = false,
        not_in_service_from = null,
        freight_capacity = null,
        unit = null,
        last_arrival = null,
      } = req.body;

      const updatedAircraft = {
        operator_id,
        model_id,
        reg_no,
        min_cabin_crew,
        min_flight_crew,
        no_of_captain,
        no_of_fo,
        no_of_fe,
        c_cls_capacity,
        y_cls_capacity,
        seating_capacity,
        cruising_speed,
        time_format,
        local_time,
        utc_time,
        block_opening_hrs,
        time_in_air_opening_hrs,
        not_in_service,
        not_in_service_from,
        freight_capacity,
        unit,
        last_arrival,
        updated_by: user_id,
      };

      // Begin a transaction
      const transaction = await sequelize.transaction();
      try {
        // Update the aircraft record
        const [updated] = await MastersAircraft.update(updatedAircraft, {
          where: { id },
          transaction,
        });

        if (!updated) {
          await transaction.rollback();
          return status.ResponseStatus(res, 400, "Failed to update aircraft");
        }

        // Commit the transaction
        await transaction.commit();
        return status.ResponseStatus(
          res,
          200,
          "Aircraft updated successfully",
          updatedAircraft
        );
      } catch (error) {
        await transaction.rollback();
        console.error("Error updating aircraft:", error.message);
        return status.ResponseStatus(res, 500, "Failed to update aircraft", {
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
  detailAircraft: async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch the aircraft details with all necessary associations
      const result = await MastersAircraft.findByPk(id, {
        include: [
          {
            association: "operator",
            attributes: ["id", "operator_name"],
          },
          {
            association: "model",
            attributes: ["id", "aircraft_model"],
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

      // Check if the aircraft exists
      if (!result)
        return status.ResponseStatus(
          res,
          404,
          `Aircraft not found with id-${id}`
        );

      // Return the aircraft details
      return status.ResponseStatus(
        res,
        200,
        `Details of aircraft with id-${id}`,
        result
      );
    } catch (error) {
      console.error("Error fetching aircraft details:", error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  deleteAircrafts: async (req, res) => {
    try {
      const { aircraft_ids = [] } = req.body;

      if (!aircraft_ids.length) {
        return status.ResponseStatus(res, 400, "No Aircraft IDs provided");
      }

      const existingAircrafts = await MastersAircraft.findAll({
        where: { id: aircraft_ids },
        attributes: ["id"],
      });

      const existingIds = existingAircrafts.map((aircraft) => aircraft.id);
      const nonExistingIds = aircraft_ids.filter(
        (id) => !existingIds.includes(id)
      );

      if (!existingIds.length)
        return status.ResponseStatus(res, 404, "No matching Aircraft(s) found");

      // Start a transaction
      const transaction = await sequelize.transaction();
      try {
        // Delete the aircrafts within the transaction
        const deletedCount = await MastersAircraft.destroy({
          where: { id: aircraft_ids },
          transaction,
        });

        if (!deletedCount) {
          await transaction.rollback();
          return status.ResponseStatus(
            res,
            404,
            "No Aircraft(s) found to delete"
          );
        }

        // Commit the transaction
        await transaction.commit();
        return status.ResponseStatus(
          res,
          200,
          "Aircraft(s) deleted successfully",
          { deleted_ids: aircraft_ids, non_existing_ids: nonExistingIds }
        );
      } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        console.error("Error deleting aircraft:", error.message);
        return status.ResponseStatus(res, 500, "Failed to delete aircraft", {
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
};
