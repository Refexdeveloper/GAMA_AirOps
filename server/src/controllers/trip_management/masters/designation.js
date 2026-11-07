const { MastersDesignation, sequelize } = require("../../../models");
const { Op } = require("sequelize");
const status = require("../../../helpers/Response");
const { validationResult } = require("express-validator");

module.exports = {
  getAllDesignation: async (req, res) => {
    try {
      const result = await MastersDesignation.findAll();
      if (!result.length) return status.ResponseStatus(res, 404, "No data");
      return res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
};
