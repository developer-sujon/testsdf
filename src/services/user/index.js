//External Lib Import
const { ObjectId } = require("mongodb");

//Internal Lib Import
const { User, Profile } = require("../../models");
const {
  role: { roleType },
  status: { statusType },
} = require("../../constant/enums");
const { defaults } = require("../../config");
const { notFoundException } = require("../../utils/error");
const { generateHash } = require("../../utils/hashing");

/**
 * Count all user
 * @param {*} param0
 * @returns
 */
const count = ({ search = "" }) => {
  const filter = {
    $and: [
      { adminId },
      {
        $or: [
          {
            name: { $regex: search, $options: "i" },
          },
          {
            email: { $regex: search, $options: "i" },
          },
        ],
      },
    ],
  };
  return User.count(filter);
};

/**
 * find all tickets
 * @param {*} param0
 * @returns {Promise<User[]}>}
 */
const findAll = async (
  adminId,
  {
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    search = defaults.search,
    expand = "",
  }
) => {
  expand = expand.split(",").map((item) => item.trim());
  const sortStr = `${sortType === "dsc" ? "-" : ""}${sortBy}`;
  const filter = {
    $and: [
      { adminId },
      {
        $or: [
          {
            name: { $regex: search, $options: "i" },
          },
          {
            email: { $regex: search, $options: "i" },
          },
        ],
      },
    ],
  };

  const profiles = await Profile.find(filter)
    .populate({ path: "userId", select: "name" })
    .sort(sortStr)
    .skip(page * limit - limit)
    .limit(limit);
  return profiles.map((profile) => ({
    ...profile._doc,
    user: profile.userId,
    id: profile.id,
    userId: undefined,
  }));
};

/**
 * find single user
 * @param {*} param0
 * @returns {Promise<User>}
 */
const findSingle = async ({ id, expand = "" }) => {
  expand = expand.split(",").map((item) => item.trim());
  const user = await Profile.findById(id);
  if (!user) {
    throw notFoundException();
  }

  if (expand.includes("user")) {
    await user.populate({
      path: "userId",
      select: "name",
      strictPopulate: false,
    });
    user._doc.user = user.userId;
    user._doc.userId = undefined;
  }

  return user;
};

/**
 * update a user
 * @param {*} param0
 * @returns {Promise<User[]>}
 */
const updateProperties = async (
  id,
  {
    name,
    email,
    password,
    dateOfBirth,
    gender,
    brief,
    profileImage,
    phone,
    fax,
    address,
    city,
    state,
    zip,
    socialMedia,
    role,
    status,
  }
) => {
  const profile = await Profile.findById(id);
  if (!profile) {
    throw notFoundException();
  }

  const user = await User.findById(profile.userId);
  if (!user) {
    throw notFoundException();
  }

  const payload = {
    name,
    email,
    password,
    dateOfBirth,
    gender,
    brief,
    profileImage,
    phone,
    fax,
    address,
    city,
    state,
    zip,
    socialMedia,
    role,
    status,
  };

  Object.keys(payload).forEach((key) => {
    profile[key] = payload[key] ?? profile[key];
    if (
      payload[key] === "name" ||
      payload[key] === "email" ||
      payload[key] === "role" ||
      payload[key] === "status"
    ) {
      user[key] = payload[key] ?? user[key];
    }
  });

  await profile.save();
  return { ...profile._doc, id: user.id };
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user ? user : false;
};

const userExist = async (email) => {
  const user = await findUserByEmail(email);
  return user ? true : false;
};

const createUser = async (
  session,
  {
    name,
    email,
    password,
    role = roleType.FREELANCER,
    status = statusType.PENDING,
  }
) => {
  const user = new User({ name, email, password, role, status });
  await user.save({ session });
  return { ...user._doc, id: user.id };
};

const createProfile = async (
  session,
  {
    adminId,
    userId,
    name,
    email,
    password,
    dateOfBirth,
    gender,
    brief,
    profileImage,
    phone,
    fax,
    address,
    city,
    state,
    zip,
    socialMedia,
    role = roleType.FREELANCER,
    status = statusType.PENDING,
  }
) => {
  const profile = new Profile({
    adminId,
    userId,
    name,
    email,
    password,
    dateOfBirth,
    gender,
    brief,
    profileImage,
    phone,
    fax,
    address,
    city,
    state,
    zip,
    socialMedia,
    role,
    status,
  });
  await profile.save({ session });
  return { ...profile._doc, id: profile.id };
};

/**
 * Delete a user
 * @param {*} param0
 * @returns {Promise<String>}
 */
const removeItem = async (id) => {
  const profile = await Profile.findByIdAndDelete(id);
  if (!profile) {
    throw notFoundException();
  }

  const user = await User.findByIdAndDelete(profile.userId);
  if (!user) {
    throw notFoundException();
  }

  return user;
};

const checkOwnership = async ({ resourceId, adminId }) => {
  const user = await Profile.findById(resourceId);
  if (!user) throw notFoundException();

  if (user._doc.adminId.toString() === adminId) {
    return true;
  }
  return false;
};

/**
 * update user password
 * @param {*} param0
 * @returns {Promise<User[]>}
 */

const changePassword = async (id, password) => {
  const user = await User.findById(id);
  if (!user) {
    throw notFoundException();
  }
  const hasPass = await generateHash(password);
  console.log(hasPass);
  user.password = hasPass;
  return await user.save();
};

module.exports = {
  userExist,
  createUser,
  findUserByEmail,
  createProfile,
  findAll,
  count,
  findSingle,
  updateProperties,
  checkOwnership,
  removeItem,
  changePassword,
};
