const { validationResult } = require("express-validator");
const Movie = require("../models/Movie");
const { normalizeError } = require("../util/normalizeError");

const mockupMovie = {
  id: 1,
  title: "Tangled",
  image: "https://localhost:3000/images/213213412323.jpg",
  releaseDate: "11/11/2010",
  rating: 4,
  characters: [
    { name: "Rapunzel", details: "https://localhost:3000/characters/1" },
  ],
};
exports.post = async (req, res, next) => {
  return res.status(201).json({ status: "New movie successfully created" });
};

exports.getAll = async (req, res, next) => {
  const mockResponse = [
    {
      id: mockupMovie.id,
      title: mockupMovie.title,
      image: mockupMovie.image,
    },
  ];
  return res.status(200).json(mockResponse);
};
exports.getOne = async (req, res, next) => {
  const requestedId = req.params.id;
  if (requestedId == mockupMovie.id) return res.status(200).json(mockupMovie);
  return next(normalizeError("Not found", 404));
};
exports.put = async (req, res, next) => {
  const requestedId = req.params.id;
  if (requestedId == mockupMovie.id)
    return res.status(200).json({ status: "Movie successfully updated" });
  return next(normalizeError("Not found", 404));
};
exports.delete = async (req, res, next) => {
  const requestedId = req.params.id;
  if (requestedId == mockupMovie.id)
    return res.status(200).json({ status: "Movie was successfully deleted" });
  return next(normalizeError("Not found", 404));
};
