const express = require("express");
const multer = require("multer");
const aircraftModelController = require("../../../controllers/trip_management/masters/aircraft_model");
const auth = require("../../../middlewares/auth");
const validation = require("../../../middlewares/trip_management/masters/aircraft_model/validator");
const uploadImages = require("../../../middlewares/trip_management/masters/aircraft_model/uploadImages");
const editImages = require("../../../middlewares/trip_management/masters/aircraft_model/editImages");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route("/search-aircraft")
  .post(
    auth.validateAPI,
    validation.searchAircraftModel,
    aircraftModelController.searchAircraftModel
  );

router
  .route("/list-of-aircrafts")
  .get(auth.validateAPI, aircraftModelController.listOfAircrafts);

router
  .route("/details-of-aircraft/:id")
  .get(auth.validateAPI, aircraftModelController.getAircraftModel);

router
  .route("/list_aircraft_models")
  .get(auth.authCheck, aircraftModelController.getAllAircraftModels);

router
  .route("/import_aircraft_models")
  .post(
    auth.authCheck,
    upload.single("file"),
    aircraftModelController.importAircraftModels
  );

router
  .route("/export_aircraft_models")
  .get(auth.authCheck, aircraftModelController.exportAircraftModels);

router
  .route("/aircraft_models")
  .get(auth.authCheck, aircraftModelController.listAircraftModels)
  .post(
    auth.authCheck,
    uploadImages,
    validation.createAircraftModel,
    aircraftModelController.createAircraftModel
  );

router
  .route("/aircraft_models/:id")
  .get(auth.authCheck, aircraftModelController.detailAircratModel)
  .put(auth.authCheck, editImages, aircraftModelController.updateAircraftModel);

router
  .route("/delete_aircraft_models")
  .post(auth.authCheck, aircraftModelController.deleteAircraftModels);

module.exports = router;
