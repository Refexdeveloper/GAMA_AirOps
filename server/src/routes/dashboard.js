const dashboardController = require("../controllers/dashboard");
const router = require("express").Router();
const dashboard = require("../controllers/dashboard");
const auth = require("../middlewares/auth");

router
  .route("/dashboard")
  .get(auth.authCheck, dashboardController.getDashboardData);

module.exports = router;
