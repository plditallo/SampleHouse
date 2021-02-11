const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require('body-parser')
const {
  NODE_ENV
} = process.env
// const csp = require('express-csp-header');
const {
  expressCspHeader,
  INLINE,
  NONE,
  SELF
} = require('express-csp-header');

module.exports = app => {
  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  // Parse application/json
  app.use(bodyParser.json());
  app.use(express.json());
  if (NODE_ENV === 'development') app.use(require("morgan")("dev"));
  app.use(helmet());
  app.use(cors());
  app.use(express.static('public'))
  app.use(expressCspHeader({
    directives: {
      'default-src': [SELF, INLINE, 'www.paypal.com', 'www.sandbox.paypal.com'],
      'script-src': [SELF, INLINE, 'unpkg.com', 'www.paypal.com', 'www.sandbox.paypal.com'],
      'style-src': [SELF, INLINE, 'www.paypal.com', 'www.sandbox.paypal.com'],
      'img-src': [SELF, 'data:'],
      'worker-src': [NONE],
      'block-all-mixed-content': true
    }
  }));

  // HTTP response header will be defined as:
  // "Content-Security-Policy: default-src 'none'; img-src 'self';"

};
