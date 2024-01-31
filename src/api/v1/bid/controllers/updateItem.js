//Internal Lib Import
const { bidService } = require("../../../../services");

const updateProperties = async (req, res, next) => {
  const { id } = req.params;

  try {
    const bid = await bidService.updateProperties(id, req.body);

    const response = {
      code: 200,
      message: "bid updated successfully",
      data: bid,
      links: {
        self: `/bids/${bid.id}`,
      },
    };

    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = updateProperties;
