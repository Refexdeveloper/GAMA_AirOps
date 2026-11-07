const router = require("express").Router();
const authController = require("../controllers/auth");
const ssoAuthController = require("../controllers/ssoAuth");
const {
  createUserSchema,
  validateLogin,
  createClientSchema,
  validateGetAccessToken,
} = require("../middlewares/user/validator");
const auth = require("../middlewares/auth");
const { SuperAdmin } = require("../utils/userRoles");

router.get("/sso-providers", ssoAuthController.listPublicProviders);
router.get("/sso/:provider", ssoAuthController.ssoRedirect);
router.get("/sso/:provider/callback", ssoAuthController.ssoCallback);

router.post("/login", validateLogin, authController.login);
router.post("/logout", auth.authCheck, authController.logout);
// router.post("/register",createUserSchema,authController.register);
// router.get("/verify_email/:token",authController.verifyMail);
router.post("/forgot_password", authController.forgotPassword);
router.patch("/reset_password/:token", authController.resetPassword);
router.post("/verify_token/:token", authController.verifyToken);
router.post(
  "/create_api_key/:user_id",
  auth.authCheck,
  auth.authRole(SuperAdmin),
  authController.createAPIKeyForUser
);
router.post(
  "/client",
  auth.authCheck,
  createClientSchema,
  authController.createClient
);
router.post(
  "/access_token",
  validateGetAccessToken,
  authController.getAccessToken
);

module.exports = router;
