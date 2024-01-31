//Internal Lib Import
const { bidService } = require("../../../../services");

const findSingle = async (req, res, next) => {
  const id = req.params.id;
  const expand = req.query.expand || "";
  try {
    const bid = await bidService.findSingle({ id, expand });
    const response = {
      statusCode: 200,
      data: bid,
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = findSingle;
