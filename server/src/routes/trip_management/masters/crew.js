const router = require("express").Router();
const crew = require("../../../controllers/trip_management/masters/crew");
const auth = require("../../../middlewares/auth");

router.route("/get_all_crew").get(auth.authCheck, crew.getAllCrew);

router.route("/delete_crew").post(auth.authCheck, crew.deleteCrews);

router
  .route("/crew")
  .get(auth.authCheck, crew.listCrew)
  .post(auth.authCheck, crew.createCrew);

router
  .route("/crew/:id")
  .get(auth.authCheck, crew.detailCrew)
  .put(auth.authCheck, crew.updateCrew);

module.exports = router;
