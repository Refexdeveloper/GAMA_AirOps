const {
  Quotation,
  Customer,
  User,
  Lead,
  ProformaInvoice,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const status = require("../helpers/Response");

module.exports = {
  getDashboardData: async (req, res) => {
    try {
      const totalUsers = await User.count();
      const totalCustomers = await Customer.count();
      const totalLeads = await Lead.count();
      const totalQuotes = await Quotation.count();
      const totalPI = await ProformaInvoice.count();

      const results = await User.findAll({
        attributes: [
          "full_name",
          [
            sequelize.fn("COUNT", sequelize.col("Quotations.created_by")),
            "created_count",
          ],
        ],
        include: [
          {
            model: Quotation,
            attributes: [],
          },
        ],
        group: ["User.full_name"],
        having: sequelize.where(
          sequelize.fn("COUNT", sequelize.col("Quotations.created_by")),
          ">",
          0
        ),
        raw: true, // Ensures raw results without Sequelize metadata
      });

      const data = {
        total_users: totalUsers,
        total_customers: totalCustomers,
        total_leads: totalLeads,
        total_quotes: totalQuotes,
        total_pi: totalPI,
        data: results,
      };

      //   console.log(results);

      return status.ResponseSuccess(res, "Dashboard Data", data);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
};
