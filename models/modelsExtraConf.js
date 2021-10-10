const { deleteFile } = require("../util/storage");
exports.setRelations = (sequelize) => {
  const { character, movie, genre, movie_character, genre_movie } =
    sequelize.models;
  movie.belongsToMany(genre, {
    through: genre_movie,
  });
  genre.belongsToMany(movie, {
    through: genre_movie,
  });
  movie.belongsToMany(character, {
    through: movie_character,
  });
  character.belongsToMany(movie, {
    through: movie_character,
  });
};

exports.addMethods = (sequelize) => {
  const { character, movie, genre, user } = sequelize.models;
  // Characters
  character.getList = (filter) => {
    return character.findAll({ attributes: ["id", "name", "image"] });
  };
  character.getDetails = (id) => {
    return character.findOne({
      where: { id: id },
      attributes: ["id", "name", "image", "age", "weight", "history"],
      include: [
        {
          model: movie,
          as: "movies",
          attributes: ["id", "title", "url"],
          through: {
            attributes: [],
          },
        },
      ],
    });
  };
  character.prototype.updateMovies = async function (newMovies) {
    await this.removeMovies(this.movies);
    if (newMovies) {
      const newMoviesObj = await movie.findAll({
        where: { id: newMovies.split(",") },
        attributes: ["id"],
      });
      await this.addMovies(newMoviesObj);
    }
  };
  // Genres
  genre.getList = (options = null) => {
    return genre.findAll({
      attributes: ["id", "name", "image"],
    });
  };
  genre.getDetails = (id) => {
    return genre.findOne({
      where: { id: id },
      include: [
        {
          model: movie,
          as: "movies",
          attributes: ["id", "title", "url"],
          through: {
            attributes: [],
          },
        },
      ],
    });
  };

  //User
  user.findByEmail = (emailToFind) => {
    return user.findOne({
      where: {
        email: emailToFind,
        status: 1,
      },
    });
  };

  //Movies
  movie.getList = (options = null) => {
    return movie.findAll({
      attributes: ["id", "title", "image", "releaseDate"],
    });
  };
  movie.getDetails = (id) => {
    return movie.findOne({
      where: { id: id },
      attributes: ["id", "title", "image", "releaseDate"],
      include: [
        {
          model: genre,
          as: "genres",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
        {
          model: character,
          as: "characters",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
    });
  };
  movie.prototype.updateGenres = async function (newGenres) {
    await this.removeGenres(this.genres);
    if (newGenres) {
      const newGenresObject = await genre.findAll({
        where: { id: newGenres.split(",") },
        attributes: ["id"],
      });
      await this.addGenres(newGenresObject);
    }
  };
  for (let model of [genre, movie, character]) {
    model.addHook("beforeDestroy", (instance, options) => {
      deleteFile(instance.image);
    });
    model.addHook("beforeUpdate", (instance, options) => {
      let key = "image";
      if (instance.getDataValue(key) !== instance.previous(key)) {
        deleteFile(instance.previous(key));
      }
    });
  }
};
