const { matchedData } = require("express-validator");
const sequelize = require("../models/sequelize");
const Genre = sequelize.models.genre;
const {
  normalizeError,
  checkValidationErrors,
} = require("../util/normalizeError");

exports.post = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  if (!req.file) return next(normalizeError("Image is required", 400));
  try {
    const bodyData = matchedData(req, { locations: ["body"] });
    bodyData.image = `/images/${req.file.filename}`;

    const newGenre = new Genre(bodyData);
    await newGenre.save();
    return res.status(201).json({ status: "New genre successfully created" });
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const genres = await Genre.getList();
    if (genres.length === 0) return res.status(204).json([]);
    res.status(200).json(genres);
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};

exports.getOne = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  try {
    const requestedId = matchedData(req, { locations: ["params"] }).id;
    const genreDetails = await Genre.getDetails(requestedId);
    if (!genreDetails) return next(normalizeError("Not found", 404));
    return res.status(200).json(genreDetails);
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
    const genreToUpdate = await Genre.findByPk(requestedId);
    if (!genreToUpdate) return next(normalizeError("Not found", 404));

    const bodyData = matchedData(req, { locations: ["body"] });
    bodyData.image = `/images/${req.file.filename}`;
    genreToUpdate.setAttributes(bodyData);

    await genreToUpdate.save();
    return res.status(200).json({ status: "Genre successfully updated" });
  } catch (err) {
    console.log(err);
    return next(normalizeError(err.message, 500));
  }
};
exports.delete = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  try {
    const requestedId = matchedData(req, { locations: ["params"] }).id;
    const genreToDelete = await Genre.findByPk(requestedId);
    if (!genreToDelete) return next(normalizeError("Not found", 404));
    await genreToDelete.destroy();
    return res.status(200).json({ status: "Genre was successfully deleted" });
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};
