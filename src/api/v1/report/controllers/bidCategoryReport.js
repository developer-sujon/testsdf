//Internal Lib Import
const { reportService } = require("../../../../services");

const bidCategoryReport = async (req, res, next) => {
  const adminId = req.user.adminId;

  try {
    const report = await reportService.bidCategoryReport(adminId);
    const response = {
      statusCode: 200,
      data: report,
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = bidCategoryReport;
