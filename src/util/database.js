const Sequelize = require("sequelize");
const { env } = require("../env/env");

let sequelize;
sequelize = new Sequelize(
  env.environment === "production" ? env.database : env.testDatabase,
  env.databaseUser,
  env.databasePassword,
  {
    dialect: "mysql",
    host: env.databaseHost,
    logging: env.environment !== "production",
  }
);
module.exports = sequelize;
