//Internal Lib Import
const { ticketService } = require("../../../../services");

const removeItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    await ticketService.removeItem(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

module.exports = removeItem;
