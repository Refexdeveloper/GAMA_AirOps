const router = require("express").Router();
const smtpController = require("../controllers/smtp");
const ssoController = require("../controllers/sso");
const auth = require("../middlewares/auth");
const { SuperAdmin } = require("../utils/userRoles");

router.get("/smtp-config", auth.authCheck, auth.authRole([SuperAdmin]), smtpController.get);
router.put("/smtp-config", auth.authCheck, auth.authRole([SuperAdmin]), smtpController.upsert);
router.post(
  "/smtp-config/test",
  auth.authCheck,
  auth.authRole([SuperAdmin]),
  smtpController.test
);

router.get("/sso-providers", auth.authCheck, auth.authRole([SuperAdmin]), ssoController.list);
router.post("/sso-providers", auth.authCheck, auth.authRole([SuperAdmin]), ssoController.create);
router.put(
  "/sso-providers/:id",
  auth.authCheck,
  auth.authRole([SuperAdmin]),
  ssoController.update
);
router.delete(
  "/sso-providers/:id",
  auth.authCheck,
  auth.authRole([SuperAdmin]),
  ssoController.remove
);

module.exports = router;
