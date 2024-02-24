//External Lib Import
const mongoose = require("mongoose");

//Internal Lib Import
const { userService } = require("../../../../services");
const {
  role: { roleType },
  status: { statusType },
} = require("../../../../constant/enums");
const createItem = async (req, res, next) => {
  const {
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
  } = req.body;

  // Using Mongoose's default connection
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const user = await userService.createUser(session, {
      name,
      email,
      password,
      role,
      status,
    });

    const profile = await userService.createProfile(session, {
      userId: user.id,
      adminId: req.user.adminId,
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

    const response = {
      statusCode: 201,
      message: "user create successful",
      data: {
        user,
        profile,
      },
      links: {
        self: `/users/${user.id}`,
      },
    };
    await session.commitTransaction();
    res.status(201).json(response);
  } catch (e) {
    await session.abortTransaction();
    next(e);
  } finally {
    session.endSession();
  }
};

module.exports = createItem;
