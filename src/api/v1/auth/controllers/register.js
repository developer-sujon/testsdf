//External Lib Import
const mongoose = require("mongoose");

//Internal Lib Import
const { authService } = require("../../../../services");
const { generateToken } = require("../../../../services/token");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  // Using Mongoose's default connection
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    const user = await authService.register(session, {
      name,
      email,
      password,
    });

    // generate access token
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const accessToken = generateToken({ payload });

    const response = {
      statusCode: 200,
      message: "Register successful",
      data: {
        access_token: accessToken,
      },
      links: {
        self: req.url,
        signin: req.url.replace("signup", "signin"),
      },
    };
    await session.commitTransaction();
    res.status(200).json(response);
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

module.exports = register;
