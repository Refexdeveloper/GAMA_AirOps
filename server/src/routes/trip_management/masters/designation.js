const router = require("express").Router();
const designation = require("../../../controllers/trip_management/masters/designation");
const auth = require("../../../middlewares/auth");

router
  .route("/get_all_designation")
  .get(auth.authCheck, designation.getAllDesignation);

module.exports = router;
