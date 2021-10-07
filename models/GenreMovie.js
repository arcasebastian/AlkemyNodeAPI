const sequelizePool = require("../util/database");
const { Model } = require("sequelize");
class GenreMovie extends Model {}
GenreMovie.init(
  {},
  {
    sequelize: sequelizePool,
    modelName: "genre_movie",
    timestamps: false,
  }
);

module.exports = GenreMovie;
