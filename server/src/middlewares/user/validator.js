const { check } = require("express-validator");
const Role = require("../../utils/userRoles");

const validation = {
  createUserSchema: [
    check("first_name")
      .trim()
      .notEmpty()
      .withMessage("This field is required and can't be empty..!"),
    check("last_name")
      .trim()
      .notEmpty()
      .withMessage("This field is required and can't be empty..!"),
    check("phone")
      .trim()
      .notEmpty()
      .withMessage("This field is required and can't be empty..!"),
    check("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email")
      .normalizeEmail(),
    // check("user_name").optional().notEmpty("User Name can't be empty"),
    check("password")
      .exists()
      .withMessage("Password is required")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters"),
    // check("photo")
    //   .trim()
    //   .notEmpty()
    //   .withMessage("This field is required and can't be empty..!"),
    check("role")
      .optional()
      .isIn([Role.SuperAdmin, Role.Admin, Role.User])
      .withMessage("Invalid Role type"),
    check("is_verified")
      .optional()
      .isBoolean()
      .withMessage("This should be boolean"),
    check("is_active")
      .optional()
      .isBoolean()
      .withMessage("This should be boolean"),
  ],
  updateUserSchema: [
    check("full_name")
      .trim()
      .notEmpty()
      .withMessage("This field is required and can't be empty..!"),
    // check("last_name")
    //   .trim()
    //   .notEmpty()
    //   .withMessage("This field is required and can't be empty..!"),
    check("phone")
      .trim()
      .notEmpty()
      .withMessage("This field is required and can't be empty..!"),
    check("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email")
      .normalizeEmail(),
    // check("user_name").optional().notEmpty("User Name can't be empty"),
    check("password")
      .exists()
      .withMessage("Password is required")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters"),
    // check("photo")
    //   .trim()
    //   .notEmpty()
    //   .withMessage("This field is required and can't be empty..!"),
    check("role")
      .optional()
      .isIn([Role.SuperAdmin, Role.Admin, Role.User])
      .withMessage("Invalid Role type"),
    check("is_verified")
      .optional()
      .isBoolean()
      .withMessage("This should be boolean"),
    check("is_active")
      .optional()
      .isBoolean()
      .withMessage("This should be boolean"),
  ],
  validateLogin: [
    check("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email")
      .normalizeEmail(),
    check("password")
      .exists()
      .withMessage("Password is required")
      .notEmpty()
      .withMessage("Password must be filled"),
    check("remember")
      .optional()
      .isBoolean()
      .withMessage("This should be boolean"),
  ],
  validateChangePassword: [
    check("old_password")
      .notEmpty()
      .withMessage("Old password is required")
      .optional({ checkFalsy: true }), // Optional if admin changing another user's password
    check("new_password")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
    check("target_user_id")
      .optional()
      .isInt()
      .withMessage("Target user ID must be an integer"),
  ],
  createClientSchema: [
    check("name")
      .trim()
      .notEmpty()
      .withMessage("This field is required and can't be empty..!"),
    check("secret")
      .exists()
      .withMessage("Secret is required")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Secret must contain at least 6 characters"),
    check("associate_user_id")
      .exists()
      .notEmpty()
      .withMessage("Associate User ID is required"),
  ],
  validateGetAccessToken: [
    check("client_id").trim().notEmpty().withMessage("Client ID is required."),
    check("client_secret")
      .trim()
      .notEmpty()
      .withMessage("Client Secret is required"),
  ],
};

module.exports = validation;
