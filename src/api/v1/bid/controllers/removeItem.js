//Internal Lib Import
const { bidService } = require("../../../../services");

const removeItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    await bidService.removeItem(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

module.exports = removeItem;
