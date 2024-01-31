//Internal Lib Import
const { userService } = require("../../../../services");

const changePassword = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await userService.changePassword(id, req.body.password);

    const response = {
      code: 200,
      message: "user password updated successfully",
      data: user,
      links: {
        self: `/users/${user.id}`,
      },
    };

    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = changePassword;
