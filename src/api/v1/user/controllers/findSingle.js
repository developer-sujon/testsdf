//Internal Lib Import
const { userService } = require("../../../../services");

const findSingle = async (req, res, next) => {
  const id = req.params.id;
  const expand = req.query.expand || "";
  try {
    const user = await userService.findSingle({ id, expand });
    const response = {
      statusCode: 200,
      data: user,
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = findSingle;
