// genTimeFrame.test.js

const genTimeFrame = require("../../src/utils/genTimeFrame");
const {
  timeFrame: { timeFrameType },
} = require("../../src/constant/enums");

describe("genTimeFrame Function", () => {
  it("should generate a daily time frame", () => {
    const timeFrame = genTimeFrame();
    const currentDate = new Date();
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    expect(timeFrame.startDate.toISOString()).toBe(startOfDay.toISOString());
    expect(timeFrame.endDate.toISOString()).toBe(endOfDay.toISOString());
  });

  it("should generate a weekly time frame", () => {
    const timeFrame = genTimeFrame(timeFrameType.WEEKLY);
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);

    expect(timeFrame.startDate.toISOString()).toBe(sevenDaysAgo.toISOString());
    expect(timeFrame.endDate.toISOString()).toBe(currentDate.toISOString());
  });

  it("should generate a monthly time frame", () => {
    const timeFrame = genTimeFrame(timeFrameType.MONTHLY);
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    endOfMonth.setHours(23, 59, 59, 999);

    expect(timeFrame.startDate.toISOString()).toBe(startOfMonth.toISOString());
    expect(timeFrame.endDate.toISOString()).toBe(endOfMonth.toISOString());
  });

  it("should generate a yearly time frame", () => {
    const timeFrame = genTimeFrame(timeFrameType.YEARLY);
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
    endOfYear.setHours(23, 59, 59, 999);

    expect(timeFrame.startDate.toISOString()).toBe(startOfYear.toISOString());
    expect(timeFrame.endDate.toISOString()).toBe(endOfYear.toISOString());
  });
});
