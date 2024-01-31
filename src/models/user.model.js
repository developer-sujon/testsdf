//External Lib Import
const { Schema, model } = require("mongoose");
const validator = require("validator");

//Internal Lib Import
const {
  role: { roleEnum, roleType },
  status: { statusEnum, statusType },
  stats: { statsEnum, statsType },
} = require("../constant/enums");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "password must contain at least one letter and one number"
          );
        }
      },
    },
    role: {
      type: String,
      enum: roleEnum,
      default: roleType.FREELANCER,
    },
    stats: {
      type: String,
      enum: statsEnum,
      default: statsType.NEW,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: statusType.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);

const User = model("User", userSchema);

module.exports = User;
