//Internal Lib Import
const { invoiceService } = require("../../../../services");

const removeItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    await invoiceService.removeItem(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

module.exports = removeItem;
