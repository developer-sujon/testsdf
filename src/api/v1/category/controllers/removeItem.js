//Internal Lib Import
const { categoryService } = require("../../../../services");

const removeItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    await categoryService.removeItem(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

module.exports = removeItem;
