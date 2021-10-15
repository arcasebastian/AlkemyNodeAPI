const sequelize = require("./database");
const { setRelations, addMethods } = require("../models/modelsExtraConf");
const modelDefiners = [
  require("../models/baseModels/Character"),
  require("../models/baseModels/User"),
  require("../models/baseModels/Movie"),
  require("../models/baseModels/Genre"),
  require("../models/baseModels/MovieCharacter"),
  require("../models/baseModels/GenreMovie"),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}
setRelations(sequelize);
addMethods(sequelize);

module.exports = sequelize;
