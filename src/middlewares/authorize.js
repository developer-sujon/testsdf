//Internal Lib Import
const { forbiddenException } = require("../utils/error");

const authorize =
  (roles = ["admin"]) =>
  (req, _res, next) => {
    console.log("User", req.user);
    if (roles.includes(req.user.role)) {
      return next();
    }

    return next(forbiddenException());
  };

module.exports = authorize;
