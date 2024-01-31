//Internal Lib Import
const {
  bid: { bidType },
  payment,
} = require("../../constant/enums");
const { Bid } = require("../../models");
const { notFoundException } = require("../../utils/error");
const { defaults } = require("../../config");

/**
 * Count all bid
 * @param {*} param0
 * @returns
 */
const count = ({ search = "" }) => {
  const filter = {
    $or: [
      {
        brief: { $regex: search, $options: "i" },
      },
    ],
  };

  return Bid.count(filter);
};

/**
 * Create a new bid
 * @param {*} param0
 * @returns {Promise<Bid>}
 */
const createItem = async ({
  adminId,
  userId,
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
}) => {
  const bid = await new Bid({
    adminId,
    userId,
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
  }).save();

  return {
    ...bid._doc,
    id: bid.id,
  };
};

/**
 * find all bids
 * @param {*} param0
 * @returns {Promise<Bid[]>}
 */
const findAll = async (
  adminId,
  {
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    search = defaults.search,
    expand = "",
  }
) => {
  expand = expand.split(",").map((item) => item.trim());
  const sortStr = `${sortType === "dsc" ? "-" : ""}${sortBy}`;
  const filter = {
    $and: [
      {
        adminId,
      },
      {
        $or: [
          // {
          //   bidNumber: { $regex: search, $options: "i" },
          // },
          {
            brief: { $regex: search, $options: "i" },
          },
        ],
      },
    ],
  };

  const bids = await Bid.find(filter)
    .populate({ path: "userId", select: "name" })
    .sort(sortStr)
    .skip(page * limit - limit)
    .limit(limit);

  return bids.map((bid) => ({
    ...bid._doc,
    user: bid.userId,
    id: bid.id,
    userId: undefined,
  }));
};

/**
 * find single bid
 * @param {*} param0
 * @returns {Promise<Bid>}
 */
const findSingle = async ({ id, expand = "" }) => {
  expand = expand.split(",").map((item) => item.trim());
  const bid = await Bid.findById(id);
  if (!bid) {
    throw notFoundException();
  }

  if (expand.includes("user")) {
    await bid.populate({
      path: "userId",
      select: "name",
      strictPopulate: false,
    });
    bid._doc.id = bid._id;
    bid._doc.user = bid.userId;
    bid._doc.userId = undefined;
  }

  return bid;
};

/**
 * update a bid
 * @param {*} param0
 * @returns {Promise<Bid>}
 */
const updateProperties = async (
  id,
  {
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
  }
) => {
  const bid = await Bid.findById(id);
  if (!bid) {
    throw notFoundException();
  }

  const payload = {
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
  };

  Object.keys(payload).forEach((key) => {
    bid[key] = payload[key] ?? bid[key];
  });

  await bid.save();
  return { ...bid._doc, id: bid.id };
};

/**
 * Delete a Bid
 * @param {*} param0
 * @returns {Promise<String>}
 */
const removeItem = async (id) => {
  const bid = await Bid.findById(id);
  if (!bid) {
    throw notFoundException();
  }
  return Bid.findByIdAndDelete(id);
};

const checkOwnership = async ({ resourceId, adminId }) => {
  const bid = await Bid.findById(resourceId);
  if (!bid) throw notFoundException();

  if (bid._doc.adminId.toString() === adminId) {
    return true;
  }
  return false;
};

module.exports = {
  count,
  createItem,
  findAll,
  findSingle,
  updateProperties,
  removeItem,
  checkOwnership,
};
