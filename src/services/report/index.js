//External Lib Import
const {
  Types: { ObjectId },
} = require("mongoose");

//Internal Lib Import
const { Bid, Profile, Invoice } = require("../../models");
const genTimeFrame = require("../../utils/genTimeFrame");
const {
  timeFrame: { timeFrameEnum },
  role: { roleType },
} = require("../../constant/enums");

const bidReport = (adminId, timeFrame) => {
  const { startDate, endDate } = genTimeFrame(timeFrame);

  const transFormationDate = {
    ...(timeFrameEnum.includes(timeFrame) && {
      dateOfBid: {
        $gte: startDate,
        $lte: endDate,
      },
    }),
  };

  const pipeline = [
    {
      $match: {
        $and: [{ adminId: new ObjectId(adminId) }, transFormationDate],
      },
    },
    {
      $group: {
        _id: { bidStatus: "$bidStatus", data: "$dateOfBid" },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        bidStatus: "$_id.bidStatus",
        data: "$_id.data",
        total: 1,
      },
    },
  ];

  const projectReport = Bid.aggregate(pipeline);
  return projectReport;
};

const bidCategoryReport = (adminId) => {
  const pipeline = [
    {
      $match: {
        adminId: new ObjectId(adminId),
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $project: {
        category: { $arrayElemAt: ["$category.name", 0] },
      },
    },
    {
      $group: {
        _id: { category: "$category" },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        total: 1,
      },
    },
  ];

  const categoryReport = Bid.aggregate(pipeline);
  return categoryReport;
};

const buyerSellerReport = (adminId, role) => {
  const pipeline = [
    {
      $match: {
        adminId: new ObjectId(adminId),
        stats: role,
      },
    },
    {
      $group: {
        _id: { stats: "$stats" },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        stats: "$_id.stats",
        total: 1,
      },
    },
  ];

  const categoryReport = Profile.aggregate(pipeline);
  return categoryReport;
};

const buyerSellerSummaryReport = (
  adminId,
  timeFrame,
  role = roleType.SELLER
) => {
  const { startDate, endDate } = genTimeFrame(timeFrame);

  const transFormationDate = {
    ...(timeFrameEnum.includes(timeFrame) && {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }),
  };

  const pipeline = [
    {
      $match: {
        $and: [
          { adminId: new ObjectId(adminId) },
          { role },
          transFormationDate,
        ],
      },
    },

    {
      $group: {
        _id: { stats: "$stats", data: "$createdAt" },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        stats: "$_id.stats",
        data: "$_id.data",
        total: 1,
      },
    },
  ];

  const projectReport = Profile.aggregate(pipeline);
  return projectReport;
};

const earningReport = (adminId, timeFrame) => {
  const { startDate, endDate } = genTimeFrame(timeFrame);

  const transFormationDate = {
    ...(timeFrameEnum.includes(timeFrame) && {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }),
  };

  const pipeline = [
    {
      $match: {
        $and: [{ adminId: new ObjectId(adminId) }, transFormationDate],
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$tax" },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];

  const earningReport = Invoice.aggregate(pipeline);
  return earningReport;
};

const earningCategoryReport = (adminId, timeFrame) => {
  const { startDate, endDate } = genTimeFrame(timeFrame);

  const transFormationDate = {
    ...(timeFrameEnum.includes(timeFrame) && {
      dateOfBid: {
        $gte: startDate,
        $lte: endDate,
      },
    }),
  };

  const pipeline = [
    {
      $match: {
        $and: [{ adminId: new ObjectId(adminId) }, transFormationDate],
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $group: {
        _id: { category: { $arrayElemAt: ["$category.name", 0] } },
        total: { $sum: "$tax" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        total: 1,
      },
    },
  ];

  const invoiceCategoryReport = Invoice.aggregate(pipeline);
  return invoiceCategoryReport;
};

module.exports = {
  bidReport,
  bidCategoryReport,
  buyerSellerReport,
  buyerSellerSummaryReport,
  earningReport,
  earningCategoryReport,
};
