//External Lib Import
const { model, Schema } = require("mongoose");

//Internal Lib Import
const {
  invoice: { invoiceEnum, invoiceType },
} = require("../constant/enums");

const invoiceSchema = new Schema(
  {
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
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    dateOfCreation: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateSent: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateDue: {
      type: Date,
      required: true,
      default: Date.now,
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
    price: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    brief: {
      type: String,
      minLength: 3,
      maxLength: 30,
    },
    status: {
      type: String,
      enum: invoiceEnum,
      default: invoiceType.NEW,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Invoice = model("Invoice", invoiceSchema);

module.exports = Invoice;
