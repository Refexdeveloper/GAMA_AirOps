const { check } = require("express-validator");

const allowedTypes = ["oneway", "roundtrip", "multicity"];

const lead = {
  enquiry: [
    check("name")
      .exists()
      .withMessage("Name is required")
      .notEmpty()
      .withMessage("Name cannot be empty"),
    check("email")
      .exists()
      .withMessage("Email is required")
      .notEmpty()
      .withMessage("Email cannot be empty")
      .isEmail()
      .withMessage("Should be a valid emmail"),
    check("phone")
      .exists()
      .withMessage("Phone is required")
      .notEmpty()
      .withMessage("Phone cannot be empty")
      .isMobilePhone()
      .withMessage("Should be a valid phone number"),
    check("remark")
      .exists()
      .withMessage("Remark is required")
      .notEmpty()
      .withMessage("Remark cannot be empty"),
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
  create: [
    check("name")
      .exists()
      .withMessage("Name is required")
      .notEmpty()
      .withMessage("Name cannot be empty"),
    check("email")
      .exists()
      .withMessage("Email is required")
      .notEmpty()
      .withMessage("Email cannot be empty")
      .isEmail()
      .withMessage("Should be a valid emmail"),
    check("phone")
      .exists()
      .withMessage("Phone is required")
      .notEmpty()
      .withMessage("Phone cannot be empty")
      .isMobilePhone()
      .withMessage("Should be a valid phone number"),
    // check("remark")
    //   .exists()
    //   .withMessage("Remark is required")
    //   .notEmpty()
    //   .withMessage("Remark cannot be empty"),
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
    check("trips")
      .exists()
      .withMessage("Trips is required")
      .isArray({ min: 1 })
      .withMessage("Trips should be an array and must not be empty"),
  ],
};

module.exports = lead;
