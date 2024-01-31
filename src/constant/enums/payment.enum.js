const paymentType = {
  CARD: "CARD",
  CASH: "CASH",
  CHEQUE: "CHEQUE",
  ESCROW: "ESCROW",
};

const paymentEnum = Object.keys(paymentType);

module.exports = {
  paymentEnum,
  paymentType,
};
