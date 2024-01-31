//Internal Lib Import
const { reportService } = require("../../../../services");

const earningReport = async (req, res, next) => {
  const adminId = req.user.adminId;
  const timeFrame = req.query.timeFrame;

  try {
    const reports = await reportService.earningReport(adminId, timeFrame);

    const response = {
      statusCode: 200,
      data: reports,
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = earningReport;
