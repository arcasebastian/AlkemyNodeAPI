require("dotenv").config();

const environment = process.env.NODE_ENV;
exports.env = {
  environment: environment,
  database: process.env.DATABASE,
  databaseUser: process.env.DATABASE_USER,
  databasePassword: process.env.DATABASE_PASSWORD,
  databaseHost: process.env.DATABASE_HOST,
  testDatabase: process.env.TEST_DATABASE,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpires: "2h",

  courierAuthorizationToken: process.env.COURIER_AUTH_TOKEN,
  courierNotificationEvent: process.env.COURIER_NOT_EVENT,
  courierBrand: process.env.COURIER_BRAND,
};
