const { validationResult } = require("express-validator");
const Character = require("../models/Character");
const { normalizeError } = require("../util/normalizeError");
const mockupCharacter = {
  id: 1,
  name: "Rapunzel",
  image: "https://localhost:3000/images/213213412323.jpg",
  age: 19,
  weight: 52,
  history:
    "Rapunzel may have lived her entire life locked inside a hidden tower, but Rapunzel is no damsel in distress. The girl with the 70 feet of golden hair is an energetic, inquisitive teenager who fills her days with art, books, and imagination. Rapunzel is full of curiosity about the outside world, and she can't help but feel that her true destiny lies outside the lonely tower walls. Rapunzel has always obeyed Mother Gothel by staying hidden away and keeping her magical hair a secret... but with her 18th birthday just a day away, she is fed up with her sheltered life and ready for adventure. When a charming thief seeks refuge in her tower, Rapunzel defies Gothel and seizes the opportunity to answer the call of the kingdom. With the unwilling Flynn Rider along for the journey, Rapunzel leaves the tower for the first time, and begins a hilarious, hair-raising journey that will untangle many secrets along the way.",
  movies: [{ title: "Tangled", details: "https://localhost:3000/movies/1" }],
};
exports.post = async (req, res, next) => {
  return res.status(201).json({ status: "New character successfully created" });
};

exports.getAll = async (req, res, next) => {
  const mockResponse = [
    {
      id: mockupCharacter.id,
      name: mockupCharacter.name,
      image: mockupCharacter.image,
    },
  ];
  return res.status(200).json(mockResponse);
};
exports.getOne = async (req, res, next) => {
  const requestedId = req.params.id;
  if (requestedId == mockupCharacter.id)
    return res.status(200).json(mockupCharacter);
  return next(normalizeError("Not found", 404));
};
exports.put = async (req, res, next) => {
  const requestedId = req.params.id;
  if (requestedId == mockupCharacter.id)
    return res.status(200).json({ status: "Character successfully updated" });
  return next(normalizeError("Not found", 404));
};
exports.delete = async (req, res, next) => {
  const requestedId = req.params.id;
  if (requestedId == mockupCharacter.id)
    return res
      .status(200)
      .json({ status: "Character was successfully deleted" });
  return next(normalizeError("Not found", 404));
};
