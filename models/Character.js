const sequelizePool = require("../util/database");
const { Model, DataTypes } = require("sequelize");
class Character extends Model {}

Character.init(
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
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    history: {
      type: DataTypes.TEXT,
      length: "medium",
      allowNull: false,
    },
  },
  {
    sequelize: sequelizePool,
    modelName: "character",
  }
);
module.exports = Character;
