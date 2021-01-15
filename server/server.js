const server = require("express")();
const apiRouter = require("./api/api-router");
const configureMiddleware = require("./api/middleware/api-config");

configureMiddleware(server);
server.use("/api", apiRouter);


module.exports = server;
//todo create a docs for the API
