//Internal Lib Import
const { reportService } = require("../../../../services");

const buyerSellerReport = async (req, res, next) => {
  const adminId = req.user.adminId;
  const role = req.query.role;

  try {
    const report = await reportService.buyerSellerReport(adminId, role);
    const response = {
      statusCode: 200,
      data: report,
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = buyerSellerReport;
