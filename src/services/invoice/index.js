//Internal Lib Import
const {
  invoice: { invoiceType },
} = require("../../constant/enums/");
const { Invoice } = require("../../models");
const { notFoundException } = require("../../utils/error");
const { defaults } = require("../../config");

/**
 * Count all invoice
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

  return Invoice.count(filter);
};

/**
 * Create a new invoice
 * @param {*} param0
 * @returns {Promise<Invoice>}
 */
const createItem = async ({
  adminId,
  userId,
  categoryId,
  invoiceNumber,
  dateOfCreation = Date.now,
  dateSent = Date.now,
  dateDue = Date.now,
  tax = 0,
  price,
  grandTotal,
  discount,
  amountDue,
  brief = "",
  status = invoiceType.NEW,
}) => {
  const invoice = await new Invoice({
    adminId,
    userId,
    categoryId,
    invoiceNumber,
    dateOfCreation,
    dateSent,
    dateDue,
    tax,
    price,
    grandTotal,
    discount,
    amountDue,
    brief,
    status,
  }).save();

  return {
    ...invoice._doc,
    id: invoice.id,
  };
};

/**
 * find all invoices
 * @param {*} param0
 * @returns {Promise<Invoice[]>}
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
          {
            invoiceNumber: { $regex: search, $options: "i" },
          },
          {
            brief: { $regex: search, $options: "i" },
          },
        ],
      },
    ],
  };

  const invoices = await Invoice.find(filter)
    .populate({ path: "userId", select: "name" })
    .sort(sortStr)
    .skip(page * limit - limit)
    .limit(limit);

  return invoices.map((invoice) => ({
    ...invoice._doc,
    user: invoice.userId,
    id: invoice.id,
    userId: undefined,
  }));
};

/**
 * find single invoice
 * @param {*} param0
 * @returns {Promise<Invoice>}
 */
const findSingle = async ({ id, expand = "" }) => {
  expand = expand.split(",").map((item) => item.trim());
  const invoice = await Invoice.findById(id);
  if (!invoice) {
    throw notFoundException();
  }

  if (expand.includes("user")) {
    await invoice.populate({
      path: "userId",
      select: "name",
      strictPopulate: false,
    });
    invoice._doc.id = invoice.id;
    invoice._doc.user = invoice.userId;
    invoice._doc.userId = undefined;
  }

  return invoice;
};

/**
 * update a invoice
 * @param {*} param0
 * @returns {Promise<Invoice>}
 */
const updateProperties = async (
  id,
  {
    invoiceNumber,
    dateOfCreation,
    dateSent,
    dateDue,
    tax,
    price,
    grandTotal,
    discount,
    amountDue,
    brief,
    status,
  }
) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) {
    throw notFoundException();
  }

  const payload = {
    invoiceNumber,
    dateOfCreation,
    dateSent,
    dateDue,
    tax,
    price,
    grandTotal,
    discount,
    amountDue,
    brief,
    status,
  };

  Object.keys(payload).forEach((key) => {
    invoice[key] = payload[key] ?? invoice[key];
  });

  await invoice.save();
  return { ...invoice._doc, id: invoice.id };
};

/**
 * Delete a invoice
 * @param {*} param0
 * @returns {Promise<String>}
 */
const removeItem = async (id) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) {
    throw notFoundException();
  }

  // const associatedBid = await Bid.findOne({ bidId: id });
  // if (associatedBid) {
  //   throw badRequestException("this bid associated bid");
  // }

  return Invoice.findByIdAndDelete(id);
};

const checkOwnership = async ({ resourceId, adminId }) => {
  const invoice = await Invoice.findById(resourceId);
  if (!invoice) throw notFoundException();

  if (invoice._doc.adminId.toString() === adminId) {
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
