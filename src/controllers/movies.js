const sequelize = require("../models/sequelize");
const Movie = sequelize.models.movie;
const {
  normalizeError,
  checkValidationErrors,
} = require("../util/normalizeError");
const { matchedData } = require("express-validator");
const { Op } = require("sequelize");

exports.post = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  if (!req.file) return next(normalizeError("Image is required", 400));

  try {
    const bodyData = matchedData(req, { locations: ["body"] });
    bodyData.image = `/images/${req.file.filename}`;

    const newMovie = new Movie(bodyData);

    await newMovie.save();
    await newMovie.updateGenres(bodyData.genres);
    return res.status(201).json({ status: "New movie successfully created" });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  try {
    const query = matchedData(req);
    const movies = await Movie.getList(setFilter(query), query.order);
    if (movies.length === 0) return res.status(204).json([]);
    return res.status(200).json(movies);
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};
exports.getOne = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  try {
    const requestedId = matchedData(req, { locations: ["params"] }).id;
    const movieDetails = await Movie.getDetails(requestedId);
    if (!movieDetails) return next(normalizeError("Not Found", 404));
    return res.status(200).json(movieDetails);
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};

exports.put = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  if (!req.file) return next(normalizeError("Image is required", 400));

  try {
    const requestedId = matchedData(req, { locations: ["params"] }).id;

    const findMovie = await Movie.findByPk(requestedId);
    if (!findMovie) return next(normalizeError("Not found", 404));
    const bodyData = matchedData(req, { locations: ["body"] });
    bodyData.image = `/images/${req.file.filename}`;
    findMovie.setAttributes(bodyData);
    await findMovie.updateGenres(bodyData.genres);
    await findMovie.save();
    return res.status(200).json({ status: "Movie successfully updated" });
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};
exports.delete = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  try {
    const requestedId = matchedData(req, { locations: ["params"] }).id;
    const movieToDelete = await Movie.findByPk(requestedId);
    if (!movieToDelete) return next(normalizeError("Not Found", 404));
    await movieToDelete.destroy();
    return res.status(200).json({ status: "Movie was successfully deleted" });
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};
function setFilter(validParams) {
  const { title, genre } = validParams;
  const filter = {};
  if (title) {
    filter.title = {
      [Op.like]: `%${title}%`,
    };
  }
  if (genre) {
    filter["$genre.id$"] = {
      [Op.eq]: genre,
    };
  }
  return filter;
}
