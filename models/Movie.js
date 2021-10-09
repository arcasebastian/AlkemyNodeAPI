const sequelizePool = require("../util/database");
const { Model, DataTypes } = require("sequelize");
const Genre = require("./Genre");
const Character = require("./Character");
class Movie extends Model {
  static getAll(options = null) {
    return Movie.findAll({
      attributes: ["id", "title", "image", "releaseDate"],
    });
  }
  static getOne(id) {
    return Movie.findOne({
      where: { id: id },
      attributes: ["id", "title", "image", "releaseDate"],
      include: [
        {
          model: Genre,
          as: "genres",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
        {
          model: Character,
          as: "characters",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
    });
  }
  async updateCharacters(newCharacters) {
    await this.removeGenres(this.characters);
    if (newCharacters) {
      const newCharactersObject = await Character.findAll({
        where: { id: newCharacters },
        attributes: ["id"],
      });
      await this.addCharacters(newCharactersObject);
    }
  }
  async updateGenres(newGenres) {
    await this.removeGenres(this.genres);
    if (newGenres) {
      const newGenresObject = await Genre.findAll({
        where: { id: newGenres },
        attributes: ["id"],
      });
      await this.addGenres(newGenresObject);
    }
  }
}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizePool,
    modelName: "movie",
  }
);
module.exports = Movie;
