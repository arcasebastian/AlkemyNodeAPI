const Sequelize = require("sequelize");
const env = require("../env/env.json");
const sequelize = new Sequelize(
  env.database,
  env.databaseUser,
  env.databasePassword,
  {
    dialect: "mysql",
    host: env.databaseHost,
  }
);

module.exports = sequelize;
