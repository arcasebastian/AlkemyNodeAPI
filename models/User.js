const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelizePool = require("../util/database");
class User extends Model {
  static findByEmail(emailToFind) {
    return this.findOne({
      where: {
        email: emailToFind,
        status: 1,
      },
    });
  }
}

User.init(
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
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
    },
  },
  {
    sequelize: sequelizePool,
    modelName: "user",
  }
);
module.exports = User;
