const Sequelize = require("sequelize");
const env = require("../env/env.json");
const { deleteFile } = require("../util/storage");
const sequelize = new Sequelize(
  env.database,
  env.databaseUser,
  env.databasePassword,
  {
    dialect: "mysql",
    host: env.databaseHost,
    define: {
      hooks: {
        beforeDestroy: (instance, options) => {
          deleteFile(instance.image);
        },
        beforeUpdate(instance, options) {
          let key = "image";
          if (instance.getDataValue(key) !== instance.previous(key)) {
            deleteFile(instance.previous(key));
          }
        },
      },
    },
  }
);

module.exports = sequelize;
