const Sequelize = require("sequelize");
const env = require("../env/env.json");

let sequelize;
sequelize = new Sequelize(
  env.database,
  env.databaseUser,
  env.databasePassword,
  {
    dialect: "mysql",
    host: env.testDatabaseHost,
    logging: false,
  }
);
module.exports = sequelize;
