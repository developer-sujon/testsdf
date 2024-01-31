//External Lib Import
require("dotenv").config();
const http = require("http");

//Internal Lib Import
const app = require("./app");
const { connectDB } = require("./database");

const server = http.createServer(app);
const mode = process.env.APP_MODE || "development";

const port = process.env.PORT || 4000;
const bootstrap = async () => {
  try {
    await connectDB();
    server.listen(port, async () => {
      console.log("Server is listening on port 4000");
      console.log(`Running in ${mode} mode`);
    });
  } catch (e) {
    console.log("Database Error");
    console.log(e);
  }
};

bootstrap();
