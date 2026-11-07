const router = require("express").Router();
const zone = require("../../../controllers/trip_management/masters/zone");
const auth = require("../../../middlewares/auth");

router.route("/all_zones").get(auth.authCheck, zone.getAllZones);
router.post("/delete_zone", auth.authCheck, zone.deleteZones);
router.route("/zone")
.get(auth.authCheck, zone.listZone)
.post(auth.authCheck, zone.createZone)

router
  .route("/zone/:id")
  .get(auth.authCheck, zone.detailZone)
  .put(auth.authCheck, zone.updateZone);

module.exports = router;
