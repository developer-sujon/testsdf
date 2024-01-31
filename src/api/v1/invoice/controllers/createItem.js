//Internal Lib Import
const { invoiceService } = require("../../../../services");

const createItem = async (req, res, next) => {
  const {
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
  } = req.body;
  try {
    const invoice = await invoiceService.createItem({
      adminId: req.user.adminId,
      userId: req.user.id,
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
    });

    const response = {
      statusCode: 201,
      message: "invoice create successful",
      data: invoice,
      links: {
        self: `/categories/${invoice.id}`,
      },
    };
    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = createItem;
