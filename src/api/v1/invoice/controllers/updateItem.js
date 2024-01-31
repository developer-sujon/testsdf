//Internal Lib Import
const { invoiceService } = require("../../../../services");

const updateProperties = async (req, res, next) => {
  const { id } = req.params;
  try {
    const invoice = await invoiceService.updateProperties(id, req.body);

    const response = {
      code: 200,
      message: "invoice updated successfully",
      data: invoice,
      links: {
        self: `/invoices/${invoice.id}`,
      },
    };

    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = updateProperties;
