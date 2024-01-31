//External Lib Import
const express = require("express");

//Internal Lib Import
const applyMiddleware = require("./middlewares");
const routes = require("./routes");

//express application
const app = express();
applyMiddleware(app);
app.use(routes);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    health: "OK",
    user: req.user,
  });
});

app.use((err, _req, res, _next) => {
  // TODO: format error
  console.log("err: ", err);
  res.status(err.status || 500).json({
    statusCode: err.status || 500,
    error:
      err.status === 400
        ? "Bad Request"
        : err.status
        ? err.error
        : "Internal Server Error",
    message: err.message,
    ...(err.errors && { data: err.errors }),
  });
});

module.exports = app;
