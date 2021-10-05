const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
//routes
const authorizationRouter = require("./routes/authorization");

const app = express();
app.use(bodyParser.json());
app.use("/auth", authorizationRouter);

const server = http.createServer(app);

sequelize.sync();
module.exports = server.listen(3000);
