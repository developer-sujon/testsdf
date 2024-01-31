//External Lib Import
const { model, Schema } = require("mongoose");

//Internal Lib Import
const {
  ticket: { ticketEnum, ticketTypes },
} = require("../constant/enums");

const ticketSchema = new Schema(
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
    ticketNumber: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    ticketSubject: {
      type: String,
      required: true,
    },
    dateOfCreation: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ticketEnum,
      required: true,
      default: ticketTypes.WEB_DESIGN,
    },
  },
  { timestamps: true, versionKey: false }
);

const Ticket = model("Ticket", ticketSchema);

module.exports = Ticket;
