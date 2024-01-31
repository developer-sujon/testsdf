const { categoryControllers } = require("./category");
const { invoiceControllers } = require("./invoice");
const { bidControllers } = require("./bid");
const { ticketControllers } = require("./ticket");
const { userControllers } = require("./user");
const { reportControllers } = require("./report");

module.exports = {
  categoryControllers,
  invoiceControllers,
  bidControllers,
  ticketControllers,
  userControllers,
  reportControllers,
};
