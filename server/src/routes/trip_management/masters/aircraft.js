const router = require("express").Router();
const aircraft = require("../../../controllers/trip_management/masters/aircraft");
const auth = require("../../../middlewares/auth");

router.post("/delete_aircrafts", auth.authCheck, aircraft.deleteAircrafts);

router.route("/all_aircrafts").get(auth.authCheck, aircraft.getAllAircrafts);

router
  .route("/aircrafts")
  .get(auth.authCheck, aircraft.listAircrafts)
  .post(auth.authCheck, aircraft.createAircraft);

router
  .route("/aircrafts/:id")
  .get(auth.authCheck, aircraft.detailAircraft)
  .put(auth.authCheck, aircraft.updateAircraft);

module.exports = router;
