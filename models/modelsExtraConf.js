exports.setRelations = (sequelize) => {
  console.log(sequelize.models);
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
  character.getOne = (id) => {
    return character.findOne({
      where: { id: id },
      attributes: ["id", "name", "image", "age", "weight"],
      include: [
        {
          model: movie,
          as: "movies",
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
  genre.getAll = (options = null) => {
    return genre.findAll({ attributes: ["id", "name", "image"] });
  };
  genre.getOne = (id) => {
    return genre.findOne({ where: { id: id } });
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
  movie.getAll = (options = null) => {
    return movie.findAll({
      attributes: ["id", "title", "image", "releaseDate"],
    });
  };
  movie.getOne = (id) => {
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
  movie.prototype.updateCharacters = async function (newCharacters) {
    await this.removeGenres(this.characters);
    if (newCharacters) {
      const newCharactersObject = await character.findAll({
        where: { id: newCharacters },
        attributes: ["id"],
      });
      await this.addCharacters(newCharactersObject);
    }
  };
  movie.prototype.updateGenres = async function (newGenres) {
    await this.removeGenres(this.genres);
    if (newGenres) {
      const newGenresObject = await genre.findAll({
        where: { id: newGenres },
        attributes: ["id"],
      });
      await this.addGenres(newGenresObject);
    }
  };
};
