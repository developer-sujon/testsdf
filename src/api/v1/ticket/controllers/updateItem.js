//Internal Lib Import
const { ticketService } = require("../../../../services");

const updateProperties = async (req, res, next) => {
  const { id } = req.params;

  try {
    const ticket = await ticketService.updateProperties(id, req.body);

    const response = {
      code: 200,
      message: "ticket updated successfully",
      data: ticket,
      links: {
        self: `/tickets/${ticket.id}`,
      },
    };

    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = updateProperties;
