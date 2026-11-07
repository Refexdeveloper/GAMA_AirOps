const { check, body } = require("express-validator");

const allowedTypes = ["oneway", "roundtrip", "multicity"];

const validation = {
  createAircraftModel: [
    body("aircraft_manufacture")
      .trim()
      .notEmpty()
      .withMessage("This field is required and can't be empty..!"),
    // body("aircraft_model").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("aircraft_type").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("wing_type").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("pilots").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("seats").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("baggages_capacity").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("aircraft_attendant_availability").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("wifi_availability").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("satellite_phone").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("lavatoty").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("cabin_height").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("cabin_width").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("cabin_length").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("period_of_manufacture").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("length").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("height").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("wingspan").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("empty_weight").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("max_take_of_weight").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("max_payload").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("fuel_capacity").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("engine").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("engine_model").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("max_ceiling").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("range").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("aircraft_per_hour_cost").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
    // body("base_location").trim().notEmpty().withMessage("This field is required and can't be empty..!"),
  ],
  updateAircraftModel: [
    check("modelName")
      .exists()
      .withMessage("Model Name is required")
      .notEmpty()
      .withMessage("Model Name should not be empty"),
    check("singleEngine")
      .exists()
      .withMessage("Engine Type is required")
      .isBoolean()
      .withMessage("Must be a boolean type"),
    check("wingType")
      .optional()
      .isIn(["Fixed Wing", "Rotary Wing"])
      .withMessage("Invalid Wing Type"),
    check("modifiedBy").exists().withMessage("Modified by is required"),
  ],
  searchAircraftModel: [
    // check("departure_airport_id").exists().withMessage("Departure Airport is required").notEmpty().withMessage("Departure Airport should not be empty"),
    // check("arrival_airport_id").exists().withMessage("Arrival Airport is required").notEmpty().withMessage("Arrival Airport should not be empty"),
    // check("pax").exists().withMessage("Pax is required").notEmpty().withMessage("Pax should not be empty"),
    // check("start_at").exists().withMessage("Start At is required").notEmpty().withMessage("Start At should not be empty"),
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
    check("included_aircraft_types")
      .optional()
      .isArray()
      .withMessage("Included aircraft types should be an array"),
  ],
};

module.exports = validation;
