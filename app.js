const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
//routes
const authorizationRouter = require("./routes/authorization");
const genresRouter = require("./routes/genres");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, PUT, POST, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization,Cache-Control,Content-Type"
  );
  if (req.method === "OPTIONS") return res.status(204).send("");
  return next();
});

app.use("/auth", authorizationRouter);
app.use((req, res, next) => {
  if (req.header("Authorization") === undefined)
    return res.status(405).json({ error: "Unauthorized" });
  return next();
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
