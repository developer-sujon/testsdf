//Internal Lib Import
const { ticketService } = require("../../../../services");

const createItem = async (req, res, next) => {
  const {
    categoryId,
    ticketNumber,
    name,
    email,
    phone,
    ticketSubject,
    dateOfCreation,
    type = "WEB_DESIGN",
  } = req.body;
  try {
    const ticket = await ticketService.createItem({
      adminId: req.user.adminId,
      userId: req.user.id,
      categoryId,
      ticketNumber,
      name,
      email,
      phone,
      ticketSubject,
      dateOfCreation,
      type,
    });

    const response = {
      statusCode: 201,
      message: "ticket create successful",
      data: ticket,
      links: {
        self: `/tickets/${ticket.id}`,
      },
    };
    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = createItem;
