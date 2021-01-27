const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require('body-parser')
const {
  NODE_ENV
} = process.env

module.exports = server => {
  // Parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({
    extended: false
  }));
  // Parse application/json
  server.use(bodyParser.json());
  server.use(express.json());
  if (NODE_ENV === 'development') server.use(require("morgan")("dev"));
  server.use(helmet());
  server.use(cors());
};
