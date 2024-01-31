//Internal Lib Import
const { ticketService } = require("../../../../services");

const findSingle = async (req, res, next) => {
  const id = req.params.id;
  const expand = req.query.expand || "";
  try {
    const ticket = await ticketService.findSingle({ id, expand });
    const response = {
      statusCode: 200,
      data: ticket,
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = findSingle;
