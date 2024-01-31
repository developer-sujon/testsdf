//Internal Lib Import
const { bidService } = require("../../../../services");
const {
  bid: { bidType },
  payment,
} = require("../../../../constant/enums");

const createItem = async (req, res, next) => {
  const {
    buyerId,
    sellerId,
    categoryId,
    bidNumber,
    dateOfBid,
    bidStatus = bidType.WAITING,
    paymentType = payment.paymentType.CARD,
    price,
    tax = 0,
    discount = 0,
    amountDue,
    brief,
  } = req.body;
  try {
    const bid = await bidService.createItem({
      userId: req.user.id,
      adminId: req.user.adminId,
      buyerId,
      sellerId,
      categoryId,
      bidNumber,
      dateOfBid,
      bidStatus,
      paymentType,
      price,
      tax,
      discount,
      amountDue,
      brief,
    });

    const response = {
      statusCode: 201,
      message: "bid create successful",
      data: bid,
      links: {
        self: `/bids/${bid.id}`,
      },
    };
    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = createItem;
