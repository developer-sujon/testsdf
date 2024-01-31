//Internal Lib Import
const {
  ticket: { ticketTypes },
} = require("../../constant/enums/");
const { Ticket } = require("../../models");
const { notFoundException } = require("../../utils/error");
const { defaults } = require("../../config");

/**
 * Count all ticket
 * @param {*} param0
 * @returns
 */
const count = ({ search = "" }) => {
  const filter = {
    $or: [
      // {
      //   ticketNumber: { $regex: search, $options: "i" },
      // },
      {
        ticketSubject: { $regex: search, $options: "i" },
      },
    ],
  };

  return Ticket.count(filter);
};

/**
 * Create a new ticket
 * @param {*} param0
 * @returns {Promise<Ticket>}
 */
const createItem = async ({
  adminId,
  userId,
  categoryId,
  ticketNumber,
  name,
  email,
  phone,
  ticketSubject,
  dateOfCreation,
  type = ticketTypes.WEB_DESIGN,
}) => {
  const ticket = await new Ticket({
    adminId,
    userId,
    categoryId,
    ticketNumber,
    name,
    email,
    phone,
    ticketSubject,
    dateOfCreation,
    type,
  }).save();

  return {
    ...ticket._doc,
    id: ticket.id,
  };
};

/**
 * find all tickets
 * @param {*} param0
 * @returns {Promise<Ticket[]>}
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
          //   ticketNumber: { $regex: search, $options: "i" },
          // },
          {
            ticketSubject: { $regex: search, $options: "i" },
          },
        ],
      },
    ],
  };

  const tickets = await Ticket.find(filter)
    .populate({ path: "userId", select: "name" })
    .sort(sortStr)
    .skip(page * limit - limit)
    .limit(limit);

  return tickets.map((ticket) => ({
    ...ticket._doc,
    user: ticket.userId,
    id: ticket.id,
    userId: undefined,
  }));
};

/**
 * find single ticket
 * @param {*} param0
 * @returns {Promise<Ticket>}
 */
const findSingle = async ({ id, expand = "" }) => {
  expand = expand.split(",").map((item) => item.trim());
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw notFoundException();
  }

  if (expand.includes("user")) {
    await ticket.populate({
      path: "userId",
      select: "name",
      strictPopulate: false,
    });
    ticket._doc.id = ticket._id;
    ticket._doc.user = ticket.userId;
    ticket._doc.userId = undefined;
    return ticket;
  }
};

/**
 * update a ticket
 * @param {*} param0
 * @returns {Promise<Ticket>}
 */
const updateProperties = async (
  id,
  {
    categoryId,
    ticketNumber,
    name,
    email,
    phone,
    ticketSubject,
    dateOfCreation,
    type,
  }
) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw notFoundException();
  }

  const payload = {
    categoryId,
    ticketNumber,
    name,
    email,
    phone,
    ticketSubject,
    dateOfCreation,
    type,
  };

  Object.keys(payload).forEach((key) => {
    ticket[key] = payload[key] ?? ticket[key];
  });

  await ticket.save();
  return { ...ticket._doc, id: ticket.id };
};

/**
 * Delete a ticket
 * @param {*} param0
 * @returns {Promise<String>}
 */
const removeItem = async (id) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw notFoundException();
  }
  return Ticket.findByIdAndDelete(id);
};

const checkOwnership = async ({ resourceId, adminId }) => {
  const ticket = await Ticket.findById(resourceId);
  if (!ticket) throw notFoundException();

  if (ticket._doc.adminId.toString() === adminId) {
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
