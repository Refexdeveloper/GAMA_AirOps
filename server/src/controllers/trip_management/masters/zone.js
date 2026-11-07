const { MastersZone, sequelize,MastersCountry,User } = require("../../../models");
const { Op } = require("sequelize");
const status = require("../../../helpers/Response");

module.exports = {
  getAllZones: async (req, res) => {
    try {
      const zones = await MastersZone.findAll();
      if (!zones) return status.ResponseStatus(res, 404, "No data available");
          let list = [];
      zones.map((con) => {
        list.push({
          id: con.id,
          name: con.zone,
        });
      });
      return res.status(200).json(list)
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },

    listZone: async (req, res) => {
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
          if (search_field === 'zone_name' && search_term) {
    whereClause['zone_name'] = { [Op.like]: `%${search_term}%` };
  }
    
          const countResult = await MastersZone.count({
            where: whereClause,
            distinct: true,
          });
    
          const rows = await MastersZone.findAll({
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
            "List of all zones",
            rows,
            info
          );
        } catch (error) {
          console.log(error);
          return status.ResponseStatus(res, 500, "Internal server error", error);
        }
      },
      createZone: async (req, res) => {
        try {
          // Validate the incoming request
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return status.ResponseStatus(res, 400, "Validation Failed", errors);
          }
    
          const { user_id } = req.session_data; // Extract user ID from session
    
          const {
          
            zone_name,
           zone_id,
           country_id
          } = req.body;
    
          // Create the new zone object
          const newZone = {
          
            zone_name,
             zone_id,
           country_id,
            created_by: user_id,
            updated_by: user_id,
          };
    
          // Insert the new crew record
          const result = await MastersZone.create(newZone);
    
          if (!result) {
            return status.ResponseStatus(res, 400, "Failed to create zone");
          }
    
          return status.ResponseStatus(
            res,
            201,
            "Zone created successfully",
            result
          );
        } catch (error) {
          console.error("Error creating zone:", error.message);
          return status.ResponseStatus(res, 500, "Internal server error", {
            error: error.message,
          });
        }
      },
      updateZone: async (req, res) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return status.ResponseStatus(res, 400, "Validation Failed", errors);
          }
    
          const { id } = req.params; // Zone ID
          const { user_id } = req.session_data;
          const {
           
            zone_name,
            time_formate
           
          } = req.body;
    
          const updatedZone = {
             zone_name,
            time_formate,
            
            updated_by: user_id,
          };
    
          // Begin a transaction
          const transaction = await sequelize.transaction();
    
          try {
            // Update the crew record
            const [updated] = await MastersZone.update(updatedZone, {
              where: { id },
              transaction,
            });
    
            if (!updated) {
              await transaction.rollback();
              return status.ResponseStatus(
                res,
                400,
                "Failed to update zone"
              );
            }
    
            // Commit the transaction
            await transaction.commit();
    
            return status.ResponseStatus(
              res,
              200,
              "Zone updated successfully",
              updatedZone
            );
          } catch (error) {
            // Rollback the transaction in case of any error
            await transaction.rollback();
            console.error("Error updating zone:", error.message);
            return status.ResponseStatus(res, 500, "Failed to update zone", {
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
      detailZone: async (req, res) => {
        try {
          const { id } = req.params;
    
          // Fetch the crew details with all necessary associations
          const result = await MastersZone.findByPk(id, {
          });
    
          // Check if the zone exists
          if (!result)
            return status.ResponseStatus(
              res,
              404,
              `Zone  not found with id-${id}`
            );
    
          // Return the crew details
          return status.ResponseStatus(
            res,
            200,
            `Details of zone with id-${id}`,
            result
          );
        } catch (error) {
          console.error("Error fetching crew details:", error.message);
          return status.ResponseStatus(res, 500, "Internal server error", {
            error: error.message,
          });
        }
      },
      deleteZones: async (req, res) => {
        try {
          const { zone = [] } = req.body;
    
          if (!zone.length) {
            return status.ResponseStatus(res, 400, "No Zone IDs provided");
          }
    
          // Fetch existing Zones
          const existingZones = await MastersZone.findAll({
            where: { id: zone },
            attributes: ["id"],
          });
    
          const existingIds = existingZones.map((crew) => crew.id);
          const nonExistingIds = zone.filter((id) => !existingIds.includes(id));
    
          if (!existingIds.length) {
            return status.ResponseStatus(res, 404, "No matching Zone(s) found");
          }
    
          // Start a transaction
          const transaction = await sequelize.transaction();
    
          try {
            // Delete the Zones within the transaction
            const deletedCount = await MastersZone.destroy({
              where: { id: zone },
              transaction,
            });
    
            if (!deletedCount) {
              await transaction.rollback();
              return status.ResponseStatus(res, 400, "No Zone(s) deleted");
            }
    
            // Commit the transaction
            await transaction.commit();
    
            return status.ResponseStatus(res, 200, "Zone(s) deleted successfully", {
              deleted_ids: existingIds,
              non_existing_ids: nonExistingIds,
            });
          } catch (error) {
            // Rollback the transaction in case of failure
            await transaction.rollback();
            console.error("Error deleting Zone(s):", error.message);
            return status.ResponseStatus(
              res,
              500,
              "Failed to delete Zone(s)",
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
