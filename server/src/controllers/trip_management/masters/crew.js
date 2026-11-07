const { MastersCrew, sequelize } = require("../../../models");
const { Op } = require("sequelize");
const status = require("../../../helpers/Response");
const { validationResult } = require("express-validator");

module.exports = {
  getAllCrew: async (req, res) => {
    try {
      const result = await MastersCrew.findAll();
      if (!result.length) return status.ResponseStatus(res, 404, "No data");

      let list = [];
      result.map((crew) => {
        list.push({
          id: crew.id,
          name: crew.name,
          email: crew.email,
          designation: crew.designation,
          on_duty_as: crew.on_duty_as,
        });
      });
      return res.status(200).json(list);
    } catch (error) {
      console.log(error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  listCrew: async (req, res) => {
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
        { association: "last_arrival_airport" },
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
              include.required = true;
            }
            return include;
          });
        } else {
          whereClause[search_field] = { [Op.like]: `%${search_term}%` };
        }
      }

      const countResult = await MastersCrew.count({
        where: whereClause,
        include: includeClause.map((include) => ({
          association: include.association,
          required: include.required,
          where: include.where,
        })),
        distinct: true,
      });

      const rows = await MastersCrew.findAll({
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
        "List of all crew members",
        rows,
        info
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  createCrew: async (req, res) => {
    try {
      // Validate the incoming request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { user_id } = req.session_data; // Extract user ID from session

      const {
        operator_id,
        photo = null,
        name,
        code,
        nationality = null,
        city,
        designation,
        on_duty_as,
        country_code = null,
        mobile_no = null,
        email = null,
        dob = null,
        passport = null,
        doj = null,
        not_in_service = false,
        not_in_service_from = null,
        gender = null,
        last_flight_on = null,
        arrival_at = null,
        applicable_models,
        applicable_critical_airports = null,
      } = req.body;

      // Create the new crew member object
      const newCrew = {
        operator_id,
        photo,
        name,
        code,
        nationality,
        city,
        designation,
        on_duty_as,
        country_code,
        mobile_no,
        email,
        dob,
        passport,
        doj,
        not_in_service,
        not_in_service_from,
        gender,
        last_flight_on,
        arrival_at,
        applicable_models,
        applicable_critical_airports,
        created_by: user_id,
        updated_by: user_id,
      };

      // Insert the new crew record
      const result = await MastersCrew.create(newCrew);

      if (!result) {
        return status.ResponseStatus(res, 400, "Failed to create crew member");
      }

      return status.ResponseStatus(
        res,
        201,
        "Crew member created successfully",
        result
      );
    } catch (error) {
      console.error("Error creating crew member:", error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  updateCrew: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { id } = req.params; // Crew ID
      const { user_id } = req.session_data;
      const {
        operator_id,
        photo = null,
        name,
        code,
        nationality = null,
        city,
        designation,
        on_duty_as,
        country_code = null,
        mobile_no = null,
        email = null,
        dob = null,
        passport = null,
        doj = null,
        not_in_service = false,
        not_in_service_from = null,
        gender = null,
        last_flight_on = null,
        arrival_at = null,
        applicable_models,
        applicable_critical_airports = null,
      } = req.body;

      const updatedCrew = {
        operator_id,
        photo,
        name,
        code,
        nationality,
        city,
        designation,
        on_duty_as,
        country_code,
        mobile_no,
        email,
        dob,
        passport,
        doj,
        not_in_service,
        not_in_service_from,
        gender,
        last_flight_on,
        arrival_at,
        applicable_models,
        applicable_critical_airports,
        updated_by: user_id,
      };

      // Begin a transaction
      const transaction = await sequelize.transaction();

      try {
        // Update the crew record
        const [updated] = await MastersCrew.update(updatedCrew, {
          where: { id },
          transaction,
        });

        if (!updated) {
          await transaction.rollback();
          return status.ResponseStatus(
            res,
            400,
            "Failed to update crew member"
          );
        }

        // Commit the transaction
        await transaction.commit();

        return status.ResponseStatus(
          res,
          200,
          "Crew member updated successfully",
          updatedCrew
        );
      } catch (error) {
        // Rollback the transaction in case of any error
        await transaction.rollback();
        console.error("Error updating crew member:", error.message);
        return status.ResponseStatus(res, 500, "Failed to update crew member", {
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
  detailCrew: async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch the crew details with all necessary associations
      const result = await MastersCrew.findByPk(id, {
        include: [
          {
            association: "operator",
            attributes: ["id", "operator_name"],
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

      // Check if the crew member exists
      if (!result)
        return status.ResponseStatus(
          res,
          404,
          `Crew member not found with id-${id}`
        );

      // Return the crew details
      return status.ResponseStatus(
        res,
        200,
        `Details of crew member with id-${id}`,
        result
      );
    } catch (error) {
      console.error("Error fetching crew details:", error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  deleteCrews: async (req, res) => {
    try {
      const { crew_ids = [] } = req.body;

      if (!crew_ids.length) {
        return status.ResponseStatus(res, 400, "No Crew IDs provided");
      }

      // Fetch existing Crews
      const existingCrews = await MastersCrew.findAll({
        where: { id: crew_ids },
        attributes: ["id"],
      });

      const existingIds = existingCrews.map((crew) => crew.id);
      const nonExistingIds = crew_ids.filter((id) => !existingIds.includes(id));

      if (!existingIds.length) {
        return status.ResponseStatus(res, 404, "No matching Crew(s) found");
      }

      // Start a transaction
      const transaction = await sequelize.transaction();

      try {
        // Delete the Crews within the transaction
        const deletedCount = await MastersCrew.destroy({
          where: { id: crew_ids },
          transaction,
        });

        if (!deletedCount) {
          await transaction.rollback();
          return status.ResponseStatus(res, 400, "No Crew(s) deleted");
        }

        // Commit the transaction
        await transaction.commit();

        return status.ResponseStatus(res, 200, "Crew(s) deleted successfully", {
          deleted_ids: existingIds,
          non_existing_ids: nonExistingIds,
        });
      } catch (error) {
        // Rollback the transaction in case of failure
        await transaction.rollback();
        console.error("Error deleting Crew(s):", error.message);
        return status.ResponseStatus(
          res,
          500,
          "Failed to delete Crew(s)",
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
