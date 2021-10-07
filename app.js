const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
//routes
const authorizationRouter = require("./routes/authorization");
const genresRouter = require("./routes/genres");
const { normalizeError } = require("./util/normalizeError");
const { uploadFile } = require("./util/storage");
const path = require("path");

const Character = require("./models/Character");
const Movie = require("./models/Movie");
const MovieCharacter = require("./models/MovieCharacter");
const Genre = require("./models/Genre");
const GenreMovie = require("./models/GenreMovie");

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
app.use((req, res, next) => {
  if (req.header("Authorization") === undefined)
    return next(normalizeError("Unauthorized", 405));
  next();
});
app.use("/genres", genresRouter);

// Generic Error Handling
app.use((error, req, res, next) => {
  const httpCode = error.statusCode || 500;
  res.status(httpCode).json({
    error: error.message,
    httpCode: httpCode,
    extraData: error.extraData,
  });
});
const server = http.createServer(app);
Movie.belongsToMany(Genre, {
  through: GenreMovie,
});
Genre.belongsToMany(Movie, {
  through: GenreMovie,
});
Character.belongsToMany(Movie, {
  through: MovieCharacter,
});
Movie.belongsToMany(Character, {
  through: MovieCharacter,
});
sequelize.sync();

module.exports = server.listen(3000);
