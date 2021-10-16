const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const sequelize = require("./models/sequelize");
//routes
const authorizationRouter = require("./routes/authorization");
const genresRouter = require("./routes/genres");
const moviesRouter = require("./routes/movies");
const charactersRouter = require("./routes/characters");

const { uploadFile, deleteFile } = require("./util/storage");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(uploadFile);
app.use("/images", express.static(path.join(__dirname, "public", "images")));

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
app.use("/genres", genresRouter);
app.use("/movies", moviesRouter);
app.use("/characters", charactersRouter);
app.use((req, res, next) => {
  return res.status(404).json({ httpCode: 404, error: "Not Found" });
});
// Generic Error Handling
app.use((error, req, res, next) => {
  if (req.file) {
    deleteFile(`/images/${req.file.filename}`);
  }
  console.error(error.message);
  const httpCode = error.statusCode || 500;
  res.status(httpCode).json({
    error: error.message,
    httpCode: httpCode,
    extraData: error.extraData,
  });
});
sequelize.sync().then(() => {
  app.listen(process.env.PORT || 80, (err, status) => {
    if (!err) console.log(`App is listening to incoming requests`);
  });
});
