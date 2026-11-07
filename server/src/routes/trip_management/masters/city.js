const router = require("express").Router();
const city = require("../../../controllers/trip_management/masters/city");
const auth = require("../../../middlewares/auth");

router.route("/all_cities").get(auth.authCheck, city.getAllCities);
router.post("/delete_city", auth.authCheck, city.deleteCitys);
router.route("/city")
.get(auth.authCheck, city.listCity)
.post(auth.authCheck, city.createCity)

router
  .route("/city/:id")
  .get(auth.authCheck, city.detailCity)
  .put(auth.authCheck, city.updateCity);

module.exports = router;
