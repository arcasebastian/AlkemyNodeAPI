const sequelize = require("../models/sequelize");
const Movie = sequelize.models.movie;
const {
  normalizeError,
  checkValidationErrors,
} = require("../util/normalizeError");

exports.post = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);

  if (!req.file) return next(normalizeError("Image is required", 400));
  const { title, rating, releaseDate, characters = "", genres = "" } = req.body;
  const imageFile = req.file.filename;
  try {
    const newMovie = new Movie({
      title: title,
      rating: rating,
      releaseDate: releaseDate,
      image: `/images/${imageFile}`,
    });
    if (await newMovie.save()) {
      await newMovie.updateCharacters(characters.split(","));
      await newMovie.updateGenres(genres.split(","));
      return res.status(201).json({ status: "New movie successfully created" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  const movies = await Movie.getAll();
  return res.status(200).json(movies);
};
exports.getOne = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);

  const requestedId = req.params.id;
  const movieDetails = await Movie.getOne(requestedId);
  if (!movieDetails) return next(normalizeError("Not Found", 404));
  return res.status(200).json(movieDetails.toJSON());
};

exports.put = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  if (!req.file) return next(normalizeError("Image is required", 400));

  const findMovie = await Movie.getOne(req.params.id);
  if (!findMovie) return next(normalizeError("Not found", 404));

  const { title, rating, releaseDate, characters = "", genres = "" } = req.body;
  const imageFile = req.file.filename;
  try {
    findMovie.setAttributes({
      title: title,
      rating: rating,
      releaseDate: releaseDate,
      image: `/images/${imageFile}`,
    });
    await findMovie.updateCharacters(characters.split(","));
    await findMovie.updateGenres(genres.split(","));
    if (await findMovie.save()) {
      return res.status(200).json({ status: "Movie successfully updated" });
    }
  } catch (err) {
    next(err);
  }
};
exports.delete = async (req, res, next) => {
  const requestedId = req.params.id;
  try {
    const movieToDelete = await Movie.findByPk(requestedId);
    if (!movieToDelete) return next(normalizeError("Not Found", 404));
    await movieToDelete.destroy();
    return res.status(200).json({ status: "Movie was successfully deleted" });
  } catch (err) {
    return next(err);
  }
};
