//Internal Lib Import
const {
  timeFrame: { timeFrameType },
} = require("../constant/enums");

const genTimeFrame = (timeFrame = timeFrameType.DAILY) => {
  const currentDate = new Date();

  // Define the date range based on the provided time frame
  let startDate, endDate;

  switch (timeFrame) {
    case timeFrameType.WEEKLY:
      startDate = new Date(currentDate - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      endDate = new Date(currentDate);
      break;
    case timeFrameType.MONTHLY:
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      endDate.setHours(23, 59, 59, 999); // End of the current month
      break;
    case timeFrameType.YEARLY:
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      endDate = new Date(currentDate.getFullYear(), 11, 31);
      endDate.setHours(23, 59, 59, 999); // End of the current year
      break;
    default:
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0); // Start of the current day
      endDate = new Date(currentDate);
      endDate.setHours(23, 59, 59, 999); // End of the current day
      break;
  }

  return {
    startDate,
    endDate,
  };
};

module.exports = genTimeFrame;
