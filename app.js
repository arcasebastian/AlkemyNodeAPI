const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
//routes
const authorizationRouter = require("./routes/authorization");
const genresRouter = require("./routes/genres");

const app = express();
app.use(bodyParser.json());
app.use("/auth", authorizationRouter);

app.options((req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE",
    "Access-Control-Allow-Headers": "Authorization,Cache-Control,Content-Type",
  });
  console.log("Get Options");
  return res.status(204).send("");
});

app.use("/genres", genresRouter);
app.use((error, req, res, next) => {
  const httpCode = error.statusCode || 500;
  res.status(httpCode).json({
    error: error.message,
    httpCode: httpCode,
    extraData: error.extraData,
  });
});
const server = http.createServer(app);

sequelize.sync();
module.exports = server.listen(3000);
