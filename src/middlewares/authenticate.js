//Internal Lib Import
const { tokenService, userService } = require("../services");
const { unauthorizedException } = require("../utils/error");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = tokenService.verifyToken({ token });

    const user = await userService.findUserByEmail(decoded.email);

    if (!user) {
      next(unauthorizedException());
    }

    if (user.status !== "APPROVED") {
      next(unauthorizedException(`Your account is ${user.status}`));
    }
    req.user = {
      ...user._doc,
      id: user.id,
      adminId: "64fcfd337535c17025069ab3",
    };
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = authentication;
