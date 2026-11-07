const { sequelize, Customer } = require("../../models");
const { Op } = require("sequelize");
const status = require("../../helpers/Response");
const { validationResult } = require("express-validator");

module.exports = {
  getNextNumber: async (req, res) => {
    try {
      const maxIdResult = await Customer.max("id");
      const nextId = (maxIdResult || 0) + 1;
      const next_number = `SAPL/CU-${String(nextId).padStart(4, "0")}`;
      res.status(200).json(next_number);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  getAllCustomers: async (req, res) => {
    try {
      const result = await Customer.findAll();
      if (!result) return status.ResponseStatus(res, 404, "No data available");
      return status.ResponseStatus(res, 200, "All Customers", result);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  createCustomer: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      const { user_id } = req.session_data;
      const {
        name,
        email,
        phone,
        address,
        gst_no,
        description,
        meal_preference,
        type,
        company_name,
      } = req.body;

      const customerData = {
        name,
        email,
        phone,
        address,
        gst_no,
        description,
        meal_preference,
        type,
        company_name,
        created_by: user_id,
        updated_by: user_id,
      };

      const result = await Customer.create(customerData);

      if (!result)
        return status.ResponseStatus(res, 400, "Failed to create customer.");

      return status.ResponseStatus(res, 200, "Customer created successfully");
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  updateCustomer: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      const { user_id } = req.session_data;
      const { id } = req.params;
      const {
        name,
        email,
        phone,
        address,
        gst_no,
        description,
        meal_preference,
        type,
        company_name,
      } = req.body;

      const data = {
        name,
        email,
        phone,
        address,
        gst_no,
        description,
        meal_preference,
        type,
        company_name,
        updated_by: user_id,
      };

      const customer = await Customer.findByPk(id);
      if (!customer)
        return status.ResponseStatus(res, 404, "Customer not found");
      const result = await Customer.update(data, { where: { id } });
      if (!result)
        return status.ResponseStatus(res, 400, "Can't update customer");
      return status.ResponseStatus(res, 200, "Customer has been updated");
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  listCustomers: async (req, res) => {
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
      const countResult = await Customer.count({
        where: whereClause,
        include: includeClause.map((include) => ({
          association: include.association,
          required: include.required,
          where: include.where,
        })),
        distinct: true, // Ensures distinct counting
      });

      // Fetch data with pagination
      const rows = await Customer.findAll({
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
        "List of all Customers",
        rows,
        info
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  detailCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Customer.findByPk(id, {
        include: [
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
          `Customer not found with id-${id}`
        );

      return status.ResponseStatus(
        res,
        200,
        `Details of Customer with id-${id}`,
        result
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  deleteCustomers: async (req, res) => {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const { customer_ids = [] } = req.body;

      if (!customer_ids.length) {
        return status.ResponseStatus(res, 400, "No Customer IDs provided");
      }

      // Fetch existing Customers
      const existingCustomers = await Customer.findAll({
        where: { id: customer_ids },
        attributes: ["id"],
      });

      const existingIds = existingCustomers.map((customer) => customer.id);
      const nonExistingIds = customer_ids.filter(
        (id) => !existingIds.includes(id)
      );

      if (!existingIds.length) {
        await transaction.rollback();
        return status.ResponseStatus(res, 404, "No matching Customers found");
      }

      try {
        // Delete parent records from Customer
        const deletedCount = await Customer.destroy({
          where: { id: existingIds },
          transaction,
        });

        if (deletedCount === 0) {
          await transaction.rollback();
          return status.ResponseStatus(res, 400, "No records deleted");
        }

        // Commit transaction
        await transaction.commit();
        return status.ResponseStatus(
          res,
          200,
          "Customers deleted successfully",
          {
            deleted_ids: existingIds,
            non_existing_ids: nonExistingIds,
          }
        );
      } catch (childError) {
        await transaction.rollback();
        console.error("Error deleting Customers:", childError.message);
        return status.ResponseStatus(
          res,
          400, // You can use a 400 Bad Request status since it's an issue with dependent records
          "Failed to delete Customer. The customer has associated Proforma Invoice(s).",
          {
            error: childError.message,
            suggestion:
              "Please delete or reassign the Proforma Invoice(s) referencing this customer before attempting to delete the customer.",
          }
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
