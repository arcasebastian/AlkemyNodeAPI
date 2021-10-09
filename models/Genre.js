const path = require("path");
const sequelizePool = require("../util/database");
const { Model, DataTypes } = require("sequelize");
class Genre extends Model {
  static getAll(options = null) {
    return Genre.findAll({ attributes: ["id", "name", "image"] });
  }
  static getOne(id) {
    return Genre.findOne({ where: { id: id } });
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
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `/genres/${this.id}`;
      },
    },
  },
  {
    sequelize: sequelizePool,
    modelName: "genre",
  }
);

module.exports = Genre;
