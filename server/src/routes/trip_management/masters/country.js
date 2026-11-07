const router = require("express").Router();
const country = require("../../../controllers/trip_management/masters/country");
const auth = require("../../../middlewares/auth");

router.route("/get_all_country").get(auth.authCheck, country.getAllCountry);

router.post("/delete_country", auth.authCheck, country.deleteCountrys);
router.route("/country")
.get(auth.authCheck, country.listCountry)
.post(auth.authCheck, country.createCountry)

router
  .route("/country/:id")
  .get(auth.authCheck, country.detailCountry)
  .put(auth.authCheck, country.updateCountry);



module.exports = router;
