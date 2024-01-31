//Internal Lib Import
const { reportService } = require("../../../../services");
const {
  role: { roleType },
} = require("../../../../constant/enums");

const buyerSellerSummaryReport = async (req, res, next) => {
  const adminId = req.user.adminId;
  const timeFrame = req.query.timeFrame;
  const role = req.query.role || roleType.SELLER;

  try {
    const reports = await reportService.buyerSellerSummaryReport(
      adminId,
      timeFrame,
      role
    );

    const response = {
      statusCode: 200,
      data: reports,
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = buyerSellerSummaryReport;
