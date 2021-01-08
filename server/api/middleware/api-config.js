const express = require("express");
const helmet = require("helmet");
// const morgan = require("morgan");
const cors = require("cors");
const {
  NODE_ENV
} = process.env

module.exports = server => {
  server.use(express.json());
  if (NODE_ENV === 'development') server.use(require("morgan")("dev"));
  server.use(helmet());
  server.use(cors());
};
