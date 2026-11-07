const { check } = require("express-validator");

const allowedTypes = ["oneway", "roundtrip", "multicity"];

module.exports = {
  downloadPDF: [
    check("aircraft_id")
      .exists()
      .withMessage("Aircraft ID is required")
      .notEmpty()
      .withMessage("Aircraft ID cannot be empty")
      .isInt()
      .withMessage("Aircraft ID should be valid number"),
    check("type")
      .exists()
      .withMessage("Type is required")
      .notEmpty()
      .withMessage("Type should not be empty")
      .isIn(allowedTypes)
      .withMessage(`Type must be one of: ${allowedTypes.join(", ")}`),
    check("data")
      .exists()
      .withMessage("Data is required")
      .isArray({ min: 1 })
      .withMessage("Data should be an array and must not be empty"),
  ],
};
