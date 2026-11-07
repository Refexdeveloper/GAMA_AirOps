const router = require("express").Router();
const userController = require("../controllers/user");
const validation = require("../middlewares/user/validator");
const auth = require("../middlewares/auth");
const uploadPhoto = require("../middlewares/user/uploadPhoto");
const Role = require("../utils/userRoles");

router.route("/all_users").get(auth.authCheck, userController.getAllUsers);

router
  .route("/users")
  .post(
    auth.authCheck,
    auth.authRole([Role.SuperAdmin]),
    uploadPhoto,
    validation.createUserSchema,
    userController.createUser
  )
  .get(
    auth.authCheck,
    auth.authRole([Role.SuperAdmin]),
    userController.listUsers
  );

router
  .route("/users/:id")
  .get(
    auth.authCheck,
    // auth.authRole([Role.SuperAdmin]),
    userController.detailUser
  )
  .put(
    auth.authCheck,
    // auth.authRole([Role.SuperAdmin]),
      uploadPhoto,
    // validation.updateUserSchema,
    userController.updateUser
  )
  .patch(
    auth.authCheck,
    // auth.authRole([Role.SuperAdmin]),
    uploadPhoto,
    userController.updateUser
  )
  .delete(
    auth.authCheck,
    auth.authRole([Role.SuperAdmin]),
    userController.deleteUser
  );

router.post(
  "/change_password",
  auth.authCheck,
  validation.validateChangePassword,
  userController.changePassword
);

module.exports = router;
