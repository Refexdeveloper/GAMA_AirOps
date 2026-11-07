const { MastersCountry, sequelize } = require("../../../models");
const { Op } = require("sequelize");
const status = require("../../../helpers/Response");
const { validationResult } = require("express-validator");

module.exports = {
  getAllCountry: async (req, res) => {
    try {
      const result = await MastersCountry.findAll();
      if (!result.length) return status.ResponseStatus(res, 404, "No data");

      let list = [];
      result.map((con) => {
        list.push({
          id: con.id,
          name: con.country_name,
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

    listCountry: async (req, res) => {
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
  
        let whereClause = {}
  
        // if (search_field && search_term) {
        //   if (search_field.includes(".")) {
        //     const [association, field] = search_field.split(".");
        //     includeClause = includeClause.map((include) => {
        //       if (include.association === association) {
        //         include.where = {
        //           [field]: { [Op.like]: `%${search_term}%` },
        //         };
        //         include.required = true;
        //       }
        //       return include;
        //     });
        //   } else {
        //     whereClause[search_field] = { [Op.like]: `%${search_term}%` };
        //   }
        // }
        if (search_field === 'country_name' && search_term) {
  whereClause['country_name'] = { [Op.like]: `%${search_term}%` };
}
  
        const countResult = await MastersCountry.count({
          where: whereClause,
          distinct: true,
        });
  
        const rows = await MastersCountry.findAll({
          where: whereClause,
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
          "List of all countrys",
          rows,
          info
        );
      } catch (error) {
        console.log(error);
        return status.ResponseStatus(res, 500, "Internal server error", error);
      }
    },
    createCountry: async (req, res) => {
      try {
        // Validate the incoming request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return status.ResponseStatus(res, 400, "Validation Failed", errors);
        }
  
        const { user_id } = req.session_data; // Extract user ID from session
  
        const {
        
          country_name,
          time_formate
        } = req.body;
  
        // Create the new country object
        const newCountry = {
        
          country_name,
         time_formate,
          created_by: user_id,
          updated_by: user_id,
        };
  
        // Insert the new crew record
        const result = await MastersCountry.create(newCountry);
  
        if (!result) {
          return status.ResponseStatus(res, 400, "Failed to create country");
        }
  
        return status.ResponseStatus(
          res,
          201,
          "Country created successfully",
          result
        );
      } catch (error) {
        console.error("Error creating country:", error.message);
        return status.ResponseStatus(res, 500, "Internal server error", {
          error: error.message,
        });
      }
    },
    updateCountry: async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return status.ResponseStatus(res, 400, "Validation Failed", errors);
        }
  
        const { id } = req.params; // Country ID
        const { user_id } = req.session_data;
        const {
         
          country_name,
          time_formate
         
        } = req.body;
  
        const updatedCountry = {
           country_name,
          time_formate,
          
          updated_by: user_id,
        };
  
        // Begin a transaction
        const transaction = await sequelize.transaction();
  
        try {
          // Update the crew record
          const [updated] = await MastersCountry.update(updatedCountry, {
            where: { id },
            transaction,
          });
  
          if (!updated) {
            await transaction.rollback();
            return status.ResponseStatus(
              res,
              400,
              "Failed to update country"
            );
          }
  
          // Commit the transaction
          await transaction.commit();
  
          return status.ResponseStatus(
            res,
            200,
            "Country member updated successfully",
            updatedCountry
          );
        } catch (error) {
          // Rollback the transaction in case of any error
          await transaction.rollback();
          console.error("Error updating country:", error.message);
          return status.ResponseStatus(res, 500, "Failed to update country", {
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
    detailCountry: async (req, res) => {
      try {
        const { id } = req.params;
  
        // Fetch the crew details with all necessary associations
        const result = await MastersCountry.findByPk(id, {
        });
  
        // Check if the country exists
        if (!result)
          return status.ResponseStatus(
            res,
            404,
            `Country  not found with id-${id}`
          );
  
        // Return the crew details
        return status.ResponseStatus(
          res,
          200,
          `Details of country with id-${id}`,
          result
        );
      } catch (error) {
        console.error("Error fetching crew details:", error.message);
        return status.ResponseStatus(res, 500, "Internal server error", {
          error: error.message,
        });
      }
    },
    deleteCountrys: async (req, res) => {
      try {
        const { country = [] } = req.body;
  
        if (!country.length) {
          return status.ResponseStatus(res, 400, "No Country IDs provided");
        }
  
        // Fetch existing Countrys
        const existingCountrys = await MastersCountry.findAll({
          where: { id: country },
          attributes: ["id"],
        });
  
        const existingIds = existingCountrys.map((crew) => crew.id);
        const nonExistingIds = country.filter((id) => !existingIds.includes(id));
  
        if (!existingIds.length) {
          return status.ResponseStatus(res, 404, "No matching Country(s) found");
        }
  
        // Start a transaction
        const transaction = await sequelize.transaction();
  
        try {
          // Delete the Countrys within the transaction
          const deletedCount = await MastersCountry.destroy({
            where: { id: country },
            transaction,
          });
  
          if (!deletedCount) {
            await transaction.rollback();
            return status.ResponseStatus(res, 400, "No Country(s) deleted");
          }
  
          // Commit the transaction
          await transaction.commit();
  
          return status.ResponseStatus(res, 200, "Country(s) deleted successfully", {
            deleted_ids: existingIds,
            non_existing_ids: nonExistingIds,
          });
        } catch (error) {
          // Rollback the transaction in case of failure
          await transaction.rollback();
          console.error("Error deleting Country(s):", error.message);
          return status.ResponseStatus(
            res,
            500,
            "Failed to delete Country(s)",
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
