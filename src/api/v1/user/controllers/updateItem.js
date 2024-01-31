//Internal Lib Import
const { userService } = require("../../../../services");

const updateProperties = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const user = await userService.updateProperties(id, req.body, userId);

    const response = {
      code: 200,
      message: "user updated successfully",
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

module.exports = updateProperties;
