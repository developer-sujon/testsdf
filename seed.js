//External Lib Import
require("dotenv").config();
const { connect, startSession } = require("mongoose");
const { User, Profile } = require("./src/models");
const { userService } = require("./src/services");
const {
  role: { roleType },
  status: { statusType },
} = require("../dist/src/constant/enums");

const { defaults } = require("./src/config");

let connectionURL =
  process.env.DB_CONNECTION_URL ||
  "mongodb://<username>:<password>@localhost:27017";
connectionURL = connectionURL.replace("<username>", process.env.DB_USERNAME);
connectionURL = connectionURL.replace("<password>", process.env.DB_PASSWORD);
// connectionURL = `${connectionURL}/${process.env.DB_NAME}?${process.env.DB_URL_QUERY}`;

(async () => {
  await connect(connectionURL, {
    dbName: "test",
    serverSelectionTimeoutMS: 5000,
  });
  console.log("Database connected");

  // Using Mongoose's default connection
  const session = await startSession();
  try {
    //remove all user & profile
    await User.deleteMany();
    await Profile.deleteMany();

    await session.startTransaction();
    const user = await userService.createUser(session, {
      name: "Test User",
      email: defaults.email,
      password: defaults.password,
      role: roleType.ADMIN,
      status: statusType.APPROVED,
    });

    await userService.createProfile(session, {
      userId: user.id,
      adminId: user.id,
      name: "Test User",
      email: defaults.email,
      role: roleType.ADMIN,
      status: statusType.APPROVED,
    });

    await session.commitTransaction();

    console.log("seed executed");
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
})();
