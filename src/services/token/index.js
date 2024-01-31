//External Lib Import
const jwt = require("jsonwebtoken");

//Internal Lib Import
const {
  serverErrorException,
  unauthorizedException,
} = require("../../utils/error");

const generateToken = ({
  payload,
  algorithm = "HS256",
  secret = process.env.ACCESS_TOKEN_SECRET,
  expiresIn = "10h",
}) => {
  try {
    return jwt.sign(payload, secret, {
      algorithm,
      expiresIn,
    });
  } catch (e) {
    console.log("[JWT]", e);
    throw serverErrorException(e.message);
  }
};

const decodeToken = ({ token, algorithm = "HS256" }) => {
  try {
    return jwt.decode(token, { algorithms: [algorithm] });
  } catch (e) {
    console.log("[JWT]", e);
    throw unauthorizedException(e.message);
  }
};

const verifyToken = ({
  token,
  algorithm = "HS256",
  secret = process.env.ACCESS_TOKEN_SECRET,
}) => {
  try {
    return jwt.verify(token, secret, { algorithms: [algorithm] });
  } catch (e) {
    console.log("[JWT]", e);
    throw unauthorizedException(e.message);
  }
};

module.exports = {
  generateToken,
  decodeToken,
  verifyToken,
};
