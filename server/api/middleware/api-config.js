const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const {
  NODE_ENV
} = process.env

module.exports = server => {
  server.use(express.json());
  if (NODE_ENV === 'development') {
    server.use(morgan("dev"));
  }
  server.use(helmet());
  server.use(cors());
};
