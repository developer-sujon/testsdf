const statusType = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  BLOCK: "BLOCK",
  DECLINE: "DECLINE",
};

const statusEnum = Object.keys(statusType);

module.exports = {
  statusType,
  statusEnum,
};
