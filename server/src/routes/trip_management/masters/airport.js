const router = require("express").Router();
const airport = require("../../../controllers/trip_management/masters/airport");
const auth = require("../../../middlewares/auth");

router.post("/delete_airport", auth.authCheck, airport.deleteAirports);

router.route("/list-of-airports").get(auth.validateAPI, airport.getAllAirports);

router.route("/airports").get(auth.authCheck, airport.getAllAirports);

router
  .route("/airport")
  .get(auth.authCheck, airport.listAirports)
  .post(auth.authCheck, airport.createAirport);

router
  .route("/airport/:id")
  .get(auth.authCheck, airport.detailAirport)
  .put(auth.authCheck, airport.updateAirport);

module.exports = router;
