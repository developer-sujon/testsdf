//External Lib Import
const { Schema, model } = require("mongoose");
const validator = require("validator");

//Internal Lib Import
const {
  role: { roleEnum, roleType },
  status: { statusEnum, statusType },
  stats: { statsEnum, statsType },
} = require("../constant/enums");

const socialMediaSchema = new Schema(
  {
    label: {
      type: String,
      minLength: 3,
      maxLength: 30,
    },
    icon: {
      type: String,
      minLength: 3,
      maxLength: 30,
    },
    link: {
      type: String,
      minLength: 3,
      maxLength: 30,
    },
  },
  { timestamps: true }
);

const profileSchema = new Schema(
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
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      minLength: 3,
      maxLength: 30,
    },
    brief: {
      type: String, // Use String for text
      minLength: 3,
      maxLength: 100,
    },
    profileImage: {
      type: String,
      minLength: 3,
      maxLength: 30,
    },
    phone: {
      type: String,
      minLength: 3,
      maxLength: 30,
    },
    fax: {
      type: String,
      minLength: 3,
      maxLength: 30,
    },
    address: {
      type: String,
      minLength: 3,
      maxLength: 30,
    },
    city: {
      type: String,
      minLength: 3,
      maxLength: 30,
    },
    state: {
      type: String,
      minLength: 3,
      maxLength: 30,
    },
    zip: {
      type: String,
      minLength: 3,
      maxLength: 30,
    },
    socialMedia: [socialMediaSchema],
    role: {
      type: String,
      enum: roleEnum,
      default: roleType.FREELANCER,
      required: true,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: statusType.PENDING,
      required: true,
    },
    stats: {
      type: String,
      enum: statsEnum,
      default: statsType.NEW,
    },
  },
  { timestamps: true, versionKey: false }
);

const Profile = model("Profile", profileSchema);

module.exports = Profile;
