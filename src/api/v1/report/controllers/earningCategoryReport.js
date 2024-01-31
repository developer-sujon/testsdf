//Internal Lib Import
const { reportService } = require("../../../../services");

const earningCategoryReport = async (req, res, next) => {
  const adminId = req.user.adminId;
  const timeFrame = req.user.timeFrame;

  try {
    const report = await reportService.earningCategoryReport(
      adminId,
      timeFrame
    );
    const response = {
      statusCode: 200,
      data: report,
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = earningCategoryReport;
