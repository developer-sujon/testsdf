//Internal Lib Import
const { invoiceService } = require("../../../../services");

const findSingle = async (req, res, next) => {
  const id = req.params.id;
  const expand = req.query.expand || "";
  try {
    const invoice = await invoiceService.findSingle({ id, expand });
    const response = {
      statusCode: 200,
      data: invoice,
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = findSingle;
