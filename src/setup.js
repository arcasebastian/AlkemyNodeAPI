const mysql = require("mysql2/promise");
const { env } = require("./env/env");
mysql
  .createConnection({
    host: env.databaseHost,
    port: "3306",
    user: env.databaseUser,
    password: env.databasePassword,
  })
  .then((connection) => {
    connection
      .query(`CREATE DATABASE IF NOT EXISTS ${env.database};`)
      .then((res) => {
        console.info("Database create or successfully checked");
        process.exit(0);
      });
  });
