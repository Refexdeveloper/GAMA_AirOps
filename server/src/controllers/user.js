const { User } = require("../models");
const { Op } = require("sequelize");
const status = require("../helpers/Response");
const Role = require("../utils/userRoles");
const { APP_URL, DEFAULT_PASSWORD } = process.env;
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: [
          "id",
          "full_name",
          "email",
          // "phone",
          "role",
          "is_verified",
          "is_active",
          "created_at",
          "updated_at",
        ],
      });
      if (!users) return status.ResponseStatus(res, 404, "No data available");
      return status.ResponseStatus(res, 200, "All Users", users);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  listUsers: async (req, res) => {
    try {
      const {
        page = 1,
        size = 10,
        sort = "id",
        order = "asc",
        search_field = "",
        search_term = "",
      } = req.query;

      const limit = parseInt(size);
      const offset = (page - 1) * limit;

      let whereClause = {};
      let includeClause = [
        { association: "creator", attributes: ["full_name", "email", "role"] },
        { association: "updater", attributes: ["full_name", "email", "role"] },
        { association: "deleter", attributes: ["full_name", "email", "role"] },
      ];

      if (search_field && search_term) {
        if (search_field.includes(".")) {
          const [association, field] = search_field.split(".");
          includeClause = includeClause.map((include) => {
            if (include.association === association) {
              include.where = {
                [field]: { [Op.like]: `%${search_term}%` },
              };
              include.required = true; // Ensures only results matching the condition are included
            }
            return include;
          });
        } else {
          whereClause[search_field] = { [Op.like]: `%${search_term}%` };
        }
      }

      // Separate count query
      const countResult = await User.count({
        where: whereClause,
        include: includeClause.map((include) => ({
          association: include.association,
          required: include.required,
          where: include.where,
        })),
        distinct: true, // Ensures distinct counting
      });

      // Fetch data with pagination
      const rows = await User.findAll({
        where: whereClause,
        include: includeClause,
        order: [[sort, order]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(countResult / limit);

      const info = {
        total_items: countResult,
        total_pages: totalPages,
        current_page: parseInt(page),
      };

      if (!rows.length) {
        return status.ResponseStatus(res, 404, "No data available");
      }

      return status.ResponseStatus(res, 200, "List of all users", rows, info);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  createUser: async (req, res) => {
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return status.ResponseStatus(res, 400, "Validation Failed", errors);
      // }
      const { user_id } = req.session_data;
      const {
        first_name,
        last_name,
        email,
        phone,
        // user_name,
        password = DEFAULT_PASSWORD,
        role = Role.User,
        is_verified = 0,
        is_active = 1,
      } = req.body;
      const user = await User.findOne({ where: { email } });
      if (user) return status.ResponseStatus(res, 409, "User already exists");
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      const userData = {
        full_name: `${first_name} ${last_name}`,
        email,
        phone,
        // user_name,
        password: hash,
        photo: req.file
          ? `${APP_URL}/${req.file.destination}/${req.file.filename}`
          : null,
        role,
        is_verified,
        is_active,
        created_by: user_id,
        updated_by: user_id,
      };
      const newUser = await User.create(userData);
      if (!newUser) return status(res, 400, "Failed to create user");
      return status.ResponseStatus(res, 200, "User created successfully", {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        phone: newUser.phone,
      });
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  detailUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (user) {
        return status.ResponseStatus(
          res,
          200,
          `Details of user (${user.email})`,
          user
        );
      }
      return status.ResponseStatus(res, 404, "User not found");
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  updateUser: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { user_id } = req.session_data;
      const { id } = req.params;

      // Check if user exists
      const user = await User.findByPk(id);
      if (!user) {
        return status.ResponseStatus(res, 404, "User not found");
      }

      // Check if email is already taken by another user
      if (req.body.email) {
        const isEmailTaken = await User.findOne({
          where: {
            email: req.body.email,
            id: { [Op.ne]: id },
          },
        });

        if (isEmailTaken) {
          return status.ResponseStatus(
            res,
            400,
            `User already exists with this email (${req.body.email})`
          );
        }
      }

      // Build the update object dynamically
      const allowedFields = [
        "full_name",
        "email",
        "phone",
        "role",
        "is_verified",
        "is_active",
      ];

      const data = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          data[field] = req.body[field];
        }
      }

      // Hash password if passed
      // if (data.password) {
      //    console.log("im working..............", data.password)
      //   const salt = await bcrypt.genSalt(saltRounds);
      //   data.password = await bcrypt.hash(data.password, salt);
      // }

      // Handle optional file upload (photo)
      if (req.file) {
        data.photo = `${APP_URL}/${req.file.destination}/${req.file.filename}`;
      }
         

      // Always update who made the change
      data.updated_by = user_id;

      const [rowsUpdated] = await User.update(data, { where: { id } });

      if (rowsUpdated === 0) {
        return status.ResponseStatus(
          res,
          400,
          "No changes applied to the user"
        );
      }

       const userDetails =await User.findByPk(id);

      return status.ResponseStatus(
        res,
        200,
        "User has been updated successfully",
        {
          email:userDetails?.email,
          photo:userDetails?.photo,
          full_name:userDetails?.full_name,
          id:userDetails?.id,
          role:userDetails?.role
        }
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  // updateUser: async (req, res) => {
  //   try {
  //     const errors = validationResult(req);
  //     const { user_id } = req.session_data;
  //     const { id } = req.params;
  //     if (req.file) {
  //       const photo = `${APP_URL}/${req.file.destination}/${req.file.filename}`;
  //       const uploaded = await User.update(
  //         { photo, updated_by: user_id },
  //         { where: { id } }
  //       );
  //       if (!uploaded)
  //         return status.ResponseStatus(res, 400, "Can't update photo");
  //       return status.ResponseStatus(res, 200, "Photo has been updated");
  //     }
  //     if (!errors.isEmpty()) {
  //       return status.ResponseStatus(res, 400, "Validation Failed", errors);
  //     }
  //     const {
  //       full_name,
  //       // last_name,
  //       email,
  //       phone,
  //       // password,
  //       role,
  //       is_verified,
  //       is_active,
  //     } = req.body;
  //     const user = await User.findByPk(id);
  //     if (!user) return status.ResponseStatus(res, 404, "User not found");

  //     const isEmailPresent = await User.findOne({
  //       where: { email, id: { [Op.ne]: id } },
  //     });
  //     if (isEmailPresent)
  //       return status.ResponseStatus(
  //         res,
  //         400,
  //         `User exists with this email already (${email})`
  //       );
  //     const data = {
  //       full_name,
  //       // last_name,
  //       email,
  //       phone,
  //       // password,
  //       role,
  //       is_verified,
  //       is_active,
  //       updated_by: user_id,
  //     };
  //     const result = await User.update(data, { where: { id } });
  //     if (!result) return status.ResponseStatus(res, 400, "Can't update user");
  //     return status.ResponseStatus(res, 200, "User has been updated");
  //   } catch (error) {
  //     console.log(error);
  //     return status.ResponseStatus(res, 500, "Internal server error", error);
  //   }
  // },
  deleteUser: async (req, res) => {
    try {
      const { user_id } = req.session_data;
      const { id } = req.params;

      // Perform soft delete and update the deleted_by field
      const user = await User.findByPk(id);
      if (user) {
        await user.update({ deleted_by: user_id });
        await user.destroy(); // This will set deletedAt and not actually delete the record

        return status.ResponseStatus(res, 200, "User deleted successfully");
      }

      return status.ResponseStatus(res, 404, "User not found");
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  changePassword: async (req, res) => {
    try {
      // Validate the request inputs
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(
          res,
          400,
          "Validation Failed",
          errors.array()
        );
      }

      const { user_id, role } = req.session_data;
      const { old_password, new_password, target_user_id } = req.body;

      let user;

      if (role === Role.SuperAdmin && target_user_id) {
        // If the user is an admin and target_user_id is provided, allow changing the password for the desired user
        user = await User.findOne({ where: { id: target_user_id } });
        if (!user) {
          return status.ResponseStatus(res, 404, "Target user not found");
        }
      } else {
        // For non-admin users or when no target_user_id is provided, change the password for the logged-in user
        user = await User.findOne({ where: { id: user_id } });
        if (!user) {
          return status.ResponseStatus(res, 404, "User not found");
        }

        // Verify the old password
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
          return status.ResponseStatus(res, 400, "Old password is incorrect");
        }
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(new_password, salt);

      // Update the user's password in the database
      user.password = hash;
      await user.save();

      return status.ResponseStatus(res, 200, "Password changed successfully");
    } catch (error) {
      console.error(error);
      return status.ResponseStatus(
        res,
        500,
        "Internal server error",
        error.message
      );
    }
  },
};
