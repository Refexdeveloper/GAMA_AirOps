const router = require("express").Router();
const operator = require("../../../controllers/trip_management/masters/operator");
const auth = require("../../../middlewares/auth");

router.route("/list-of-operators").get(auth.authCheck, operator.getAllOperator);

module.exports = router;
