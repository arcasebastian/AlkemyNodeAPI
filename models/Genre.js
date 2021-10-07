const path = require("path");
const sequelizePool = require("../util/database");
const { Model, DataTypes } = require("sequelize");
const { deleteFile } = require("../util/storage");
const Movie = require("./Movie");
class Genre extends Model {
  static getAll(options = null) {
    return Genre.findAll({ attributes: ["id", "name", "image"] });
  }
  static getOne(id) {
    return Genre.findOne({ where: { id: id }, include: Movie });
  }
}

Genre.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeDestroy: (genre, options) => {
        deleteFile(`../public${genre.image}`);
      },
    },
    sequelize: sequelizePool,
    modelName: "genre",
  }
);

module.exports = Genre;