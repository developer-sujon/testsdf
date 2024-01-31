//External Lib Import
const express = require("express");
const YAML = require("yamljs");
const OpenApiValidator = require("express-openapi-validator");
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");
const morgan = require("morgan");

//Internal Lib Import
const swaggerDoc = YAML.load("./swagger.yaml");

const applyMiddleware = (app) => {
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cors());
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  app.use(
    OpenApiValidator.middleware({
      apiSpec: "./swagger.yaml",
    })
  );
};

module.exports = applyMiddleware;
