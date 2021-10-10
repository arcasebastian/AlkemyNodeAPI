const { matchedData } = require("express-validator");
const sequelize = require("../models/sequelize");
const Character = sequelize.models.character;
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
    const newCharacter = new Character(bodyData);
    await newCharacter.save();
    await newCharacter.updateMovies(bodyData.movies);
    return res
      .status(201)
      .json({ status: "New character successfully created" });
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const charactersList = await Character.getList("");
    return res.status(200).json(charactersList);
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};
exports.getOne = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  try {
    const requestedId = matchedData(req, { locations: ["params"] }).id;
    const characterDetails = await Character.getDetails(requestedId);
    if (!characterDetails) return next(normalizeError("Not found", 404));
    return res.status(200).json(characterDetails);
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};
exports.put = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  if (!req.file) return next(normalizeError("Image is required", 400));
  try {
    const characterToUpdate = await Character.findByPk(req.params.id);
    if (!characterToUpdate) return next(normalizeError("Not found", 404));
    const bodyData = matchedData(req, { locations: ["body"] });
    bodyData.image = `/images/${req.file.filename}`;
    characterToUpdate.setAttributes(bodyData);
    await characterToUpdate.updateMovies(bodyData.movies);
    await characterToUpdate.save();
    return res.status(200).json({ status: "Character successfully updated" });
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};
exports.delete = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  try {
    const requestedId = matchedData(req, { locations: ["params"] }).id;
    const characterToRemove = await Character.findByPk(requestedId);
    if (!characterToRemove) return next(normalizeError("Not Found", 404));
    await characterToRemove.destroy();
    return res
      .status(200)
      .json({ status: "Character was successfully deleted" });
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};
