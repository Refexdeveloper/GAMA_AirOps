const { MastersOperator, sequelize } = require("../../../models");
const { Op } = require("sequelize");
const status = require("../../../helpers/Response");
const { validationResult } = require("express-validator");

module.exports = {
  getAllOperator: async (req, res) => {
    try {
      const result = await MastersOperator.findAll();
      if (!result.length) return status.ResponseStatus(res, 404, "No data");

      let list = [];
      result.map((operator) => {
        list.push({
          id: operator.id,
          operator_name: operator.operator_name,
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
};
