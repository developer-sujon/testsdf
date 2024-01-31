//Internal Lib Import
const { categoriesType } = require("../../constant/enums/category.enum");
const { Category, Bid, Ticket, Invoice } = require("../../models");
const { notFoundException, badRequestException } = require("../../utils/error");
const { defaults } = require("../../config");

/**
 * Create a new category
 * @param {*} param0
 * @returns {Promise<Category>}
 */
const createItem = async ({
  name,
  active = false,
  type = categoriesType.BID,
  userId,
  adminId,
}) => {
  const category = await new Category({
    name,
    active,
    type,
    userId,
    adminId,
  }).save();

  return {
    ...category._doc,
    id: category.id,
  };
};

/**
 * find all categories
 * @param {*} param0
 * @returns {Promise<Category[]>}
 */
const findAll = async (
  adminId,
  {
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    categoryType = "",
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
        ...(categoryType && { type: categoryType }),
      },
      {
        $or: [
          {
            name: { $regex: search, $options: "i" },
          },
          {
            type: { $regex: search, $options: "i" },
          },
        ],
      },
    ],
  };

  const categories = await Category.find(filter)
    .populate({ path: "userId", select: "name" })
    .sort(sortStr)
    .skip(page * limit - limit)
    .limit(limit);

  return categories.map((category) => ({
    ...category._doc,
    user: category.userId,
    id: category.id,
    userId: undefined,
  }));
};

/**
 * find single category
 * @param {*} param0
 * @returns {Promise<Category>}
 */
const findSingle = async ({ id, expand = "" }) => {
  expand = expand.split(",").map((item) => item.trim());
  const category = await Category.findById(id);
  if (!category) {
    throw notFoundException();
  }

  if (expand.includes("user")) {
    await category.populate({
      path: "userId",
      select: "name",
      strictPopulate: false,
    });
    category._doc.id = category.id;
    category._doc.user = category.userId;
    category._doc.userId = category.userId._id;
  }

  return category;
};

/**
 * update a category
 * @param {*} param0
 * @returns {Promise<Category>}
 */
const updateProperties = async (
  id,
  { name, active = false, type = categoriesType.BID }
) => {
  const category = await Category.findById(id);
  if (!category) {
    throw notFoundException();
  }

  const payload = { name, active, type };

  Object.keys(payload).forEach((key) => {
    category[key] = payload[key] ?? category[key];
  });

  await category.save();
  return { ...category._doc, id: category.id };
};

/**
 * Delete a category
 * @param {*} param0
 * @returns {Promise<String>}
 */
const removeItem = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw notFoundException();
  }

  const associatedBid = await Bid.findOne({ categoryId: id });
  if (associatedBid) {
    throw badRequestException("this category associated bid");
  }

  const associatedTicket = await Ticket.findOne({ categoryId: id });
  if (associatedTicket) {
    throw badRequestException("this category associated ticket");
  }

  const associatedInvoice = await Invoice.findOne({ categoryId: id });
  if (associatedInvoice) {
    throw badRequestException("this category associated invoice");
  }

  return Category.findByIdAndDelete(id);
};

/**
 * Count all article
 * @param {*} param0
 * @returns
 */
const count = ({ search = "" }) => {
  const filter = {
    $or: [
      {
        name: { $regex: search, $options: "i" },
      },
      {
        type: { $regex: search, $options: "i" },
      },
    ],
  };

  return Category.count(filter);
};

const checkOwnership = async ({ resourceId, adminId }) => {
  const category = await Category.findById(resourceId);
  if (!category) throw notFoundException();

  if (category._doc.adminId.toString() === adminId) {
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
