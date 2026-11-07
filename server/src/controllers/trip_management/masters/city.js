const { MastersCity, sequelize,MastersCountry,MastersZone,User } = require("../../../models");
const { Op } = require("sequelize");
const status = require("../../../helpers/Response");

module.exports = {
  getAllCities: async (req, res) => {
    try {
      const cities = await MastersCity.findAll();
      if (!cities) return status.ResponseStatus(res, 404, "No data available");
      
      return status.ResponseStatus(res, 200, "All Cities", cities);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },

    listCity: async (req, res) => {
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

          let includeClause = [
      {
        model: MastersCountry,
        as: 'country',
        attributes: ['id', 'country_name'],
      },
      {
        model: MastersZone,
        as: 'zone',
           attributes: ['id', 'zone'],
      },
      {
        model: User,
        as: 'created_user',
        attributes: ['id', 'full_name'],
      },
      {
        model: User,
        as: 'updated_user',
        attributes: ['id', 'full_name'],
      },
    ];
    
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
          if (search_field === 'city_name' && search_term) {
    whereClause['city_name'] = { [Op.like]: `%${search_term}%` };
  }
    
          const countResult = await MastersCity.count({
            where: whereClause,
              include: includeClause,
            distinct: true,
          });
    
          const rows = await MastersCity.findAll({
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
            "List of all citys",
            rows,
            info
          );
        } catch (error) {
          console.log(error);
          return status.ResponseStatus(res, 500, "Internal server error", error);
        }
      },
      createCity: async (req, res) => {
        try {
          // Validate the incoming request
          // const errors = validationResult(req);
          // if (!errors.isEmpty()) {
          //   return status.ResponseStatus(res, 400, "Validation Failed", errors);
          // }
    
          const { user_id } = req.session_data; // Extract user ID from session
    
          const {
          
            city_name,
           zone_id,
           country_id
          } = req.body;
    
          // Create the new city object
          const newCity = {
          
            city_name,
             zone_id,
           country_id,
            created_by: user_id,
            updated_by: user_id,
          };
    
          // Insert the new crew record
          const result = await MastersCity.create(newCity);
    
          if (!result) {
            return status.ResponseStatus(res, 400, "Failed to create city");
          }
    
          return status.ResponseStatus(
            res,
            201,
            "City created successfully",
            result
          );
        } catch (error) {
          console.error("Error creating city:", error.message);
          return status.ResponseStatus(res, 500, "Internal server error", {
            error: error.message,
          });
        }
      },
      updateCity: async (req, res) => {
        try {
          // const errors = validationResult(req);
          // if (!errors.isEmpty()) {
          //   return status.ResponseStatus(res, 400, "Validation Failed", errors);
          // }
    
          const { id } = req.params; // City ID
          const { user_id } = req.session_data;
          const {
           
           city_name,
             zone_id,
           country_id,
           
          } = req.body;
    
          const updatedCity = {
           city_name,
             zone_id,
           country_id,
            
            updated_by: user_id,
          };
    
          // Begin a transaction
          const transaction = await sequelize.transaction();
    
          try {
            // Update the crew record
            const [updated] = await MastersCity.update(updatedCity, {
              where: { id },
              transaction,
            });
    
            if (!updated) {
              await transaction.rollback();
              return status.ResponseStatus(
                res,
                400,
                "Failed to update city"
              );
            }
    
            // Commit the transaction
            await transaction.commit();
    
            return status.ResponseStatus(
              res,
              200,
              "City updated successfully",
              updatedCity
            );
          } catch (error) {
            // Rollback the transaction in case of any error
            await transaction.rollback();
            console.error("Error updating city:", error.message);
            return status.ResponseStatus(res, 500, "Failed to update city", {
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
      detailCity: async (req, res) => {
        try {
          const { id } = req.params;
    
          // Fetch the crew details with all necessary associations
          const result = await MastersCity.findByPk(id,  {
      include: [
        {
          model: MastersCountry,
          as: 'country',
          attributes: ['id', 'country_name'], // Select only required fields
        },
        {
          model: MastersZone,
          as: 'zone',
          attributes: ['id', 'zone'], // Select only required fields
        },
      ],
    });
    
          // Check if the city exists
          if (!result)
            return status.ResponseStatus(
              res,
              404,
              `City  not found with id-${id}`
            );
    
          // Return the crew details
          return status.ResponseStatus(
            res,
            200,
            `Details of city with id-${id}`,
            result
          );
        } catch (error) {
          console.error("Error fetching crew details:", error.message);
          return status.ResponseStatus(res, 500, "Internal server error", {
            error: error.message,
          });
        }
      },
      deleteCitys: async (req, res) => {
        try {
          const { city = [] } = req.body;
    
          if (!city.length) {
            return status.ResponseStatus(res, 400, "No City IDs provided");
          }
    
          // Fetch existing Citys
          const existingCitys = await MastersCity.findAll({
            where: { id: city },
            attributes: ["id"],
          });
    
          const existingIds = existingCitys.map((crew) => crew.id);
          const nonExistingIds = city.filter((id) => !existingIds.includes(id));
    
          if (!existingIds.length) {
            return status.ResponseStatus(res, 404, "No matching City(s) found");
          }
    
          // Start a transaction
          const transaction = await sequelize.transaction();
    
          try {
            // Delete the Citys within the transaction
            const deletedCount = await MastersCity.destroy({
              where: { id: city },
              transaction,
            });
    
            if (!deletedCount) {
              await transaction.rollback();
              return status.ResponseStatus(res, 400, "No City(s) deleted");
            }
    
            // Commit the transaction
            await transaction.commit();
    
            return status.ResponseStatus(res, 200, "City(s) deleted successfully", {
              deleted_ids: existingIds,
              non_existing_ids: nonExistingIds,
            });
          } catch (error) {
            // Rollback the transaction in case of failure
            await transaction.rollback();
            console.error("Error deleting City(s):", error.message);
            return status.ResponseStatus(
              res,
              500,
              "Failed to delete City(s)",
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
