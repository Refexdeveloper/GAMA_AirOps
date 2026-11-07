const jwt = require("jsonwebtoken");
const { APP_KEY, API_KEY } = process.env;
const { User } = require("../models");
const status = require("../helpers/Response");

exports.authCheck = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    const token = authorization.substr(7);
    try {
      const data = jwt.verify(token, APP_KEY);
      req.session_data = data;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return status.ResponseStatus(res, 401, "Token has expired!", error);
      } else {
        return status.ResponseStatus(res, 401, "Invalid token!", error);
      }
      // return status.ResponseStatus(res, 401, "Invalid token", error);
    }
  }
  return status.ResponseStatus(res, 401, "Authorization needed");
};

exports.authRole = (roles = []) => {
  return async (req, res, next) => {
    const data = req.session_data;
    const foundUser = await User.findByPk(data.user_id);
    if (foundUser) {
      if (roles.includes(foundUser.role)) {
        return next();
      }
    }
    return status.ResponseStatus(res, 403, "You don't have permission");
  };
};

exports.validateAPI = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    const token = authorization.substr(7);
    try {
      const data = jwt.verify(token, API_KEY);
      if (data) {
        req.session_data = data;
        return next();
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return status.ResponseStatus(res, 401, "Token has expired!", error);
      } else {
        return status.ResponseStatus(res, 401, "Invalid token!", error);
      }
      // return status.ResponseStatus(res, 401, "Invalid token", error);
    }
  }
  return status.ResponseStatus(res, 401, "Authorization needed");
};
