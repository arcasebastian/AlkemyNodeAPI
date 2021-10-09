const sequelizePool = require("../../util/database");
const { Model } = require("sequelize");
class MovieCharacter extends Model {}

module.exports = (sequelize) => {
  sequelize.define("movie_character", {});
};
