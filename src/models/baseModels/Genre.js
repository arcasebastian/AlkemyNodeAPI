const { DataTypes } = require("sequelize");
const { deleteFile } = require("../../util/storage");

module.exports = (sequelize) => {
  sequelize.define("genre", {
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
  });
};
