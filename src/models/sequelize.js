const sequelize = require("../util/database");
const { setRelations, addMethods } = require("./modelsExtraConf");
const modelDefiners = [
  require("./baseModels/Character"),
  require("./baseModels/User"),
  require("./baseModels/Movie"),
  require("./baseModels/Genre"),
  require("./baseModels/MovieCharacter"),
  require("./baseModels/GenreMovie"),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}
setRelations(sequelize);
addMethods(sequelize);

module.exports = sequelize;
