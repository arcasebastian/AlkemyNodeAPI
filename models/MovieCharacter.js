const sequelizePool = require("../util/database");
const { Model } = require("sequelize");
const Character = require("./Character");
const Movie = require("./Movie");
class MovieCharacter extends Model {}

MovieCharacter.init(
  {},
  {
    sequelize: sequelizePool,
    modelName: "movie_character",
  }
);

module.exports = MovieCharacter;
