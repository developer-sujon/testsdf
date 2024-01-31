//External Lib Import
const { model, Schema } = require("mongoose");

//Internal Lib Import
const {
  bid: { bidEnum, bidType },
  payment: { paymentEnum, paymentType },
} = require("../constant/enums");

const bidSchema = new Schema({
  adminId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  bidNumber: {
    type: Number,
    required: true,
  },
  dateOfBid: {
    type: Date,
    default: Date.now,
    required: true,
  },
  bidStatus: {
    type: String,
    enum: bidEnum,
    default: bidType.WAITING,
    required: true,
  },
  paymentType: {
    type: String,
    enum: paymentEnum,
    default: paymentType.CARD,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
    default: 0,
  },
  discount: {
    type: Number,
  },
  amountDue: {
    type: Number,
  },
  brief: {
    type: String,
    minLength: 3,
    maxLength: 100,
  },
});

const Bid = model("Bid", bidSchema);

module.exports = Bid;
