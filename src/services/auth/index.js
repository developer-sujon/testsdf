//Internal Lib Import
const {
  userExist,
  createUser,
  findUserByEmail,
  createProfile,
} = require("../user");
const {
  badRequestException,
  unauthorizedException,
} = require("../../utils/error");
const { generateHash, hashMatched } = require("../../utils/hashing");
const { generateToken } = require("../token");
const { Profile } = require("../../models");

const register = async (session, { name, email, password }) => {
  const hasUser = await userExist(email);
  if (hasUser) {
    throw badRequestException("User already exist");
  }
  password = await generateHash(password);
  const user = await createUser(session, { name, email, password });
  await createProfile(session, {
    adminId: user._id,
    userId: user._id,
    name,
    email,
  });

  return user;
};

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  console.log(user, email);
  if (!user) {
    throw unauthorizedException("Invalid Credentials");
  }

  const matched = await hashMatched(password, user.password);
  if (!matched) {
    throw unauthorizedException("Invalid Credentials");
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return generateToken({ payload });
};

module.exports = {
  register,
  login,
};
