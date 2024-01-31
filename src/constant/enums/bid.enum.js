const bidType = {
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  SELECTED: "SELECTED",
  WAITING: "WAITING",
};

const bidEnum = Object.keys(bidType);

module.exports = {
  bidType,
  bidEnum,
};
