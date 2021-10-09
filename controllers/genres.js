const { validationResult } = require("express-validator");
const Genre = require("../models/Genre");
const { normalizeError } = require("../util/normalizeError");

exports.post = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { name } = req.body;
    if (!req.file) {
      return next(normalizeError("Image is required", 400));
    }
    const imageFile = req.file.filename;
    const newGenre = new Genre({
      name: name,
      image: `/images/${imageFile}`,
    });
    if (await newGenre.save()) {
      return res.status(201).json({ status: "New genre successfully created" });
    }
  } else {
    let firstError = errors.array({ onlyFirstError: true })[0];
    let errorCode = firstError.msg.includes("already") ? 409 : 400;
    return next(normalizeError(firstError.msg, errorCode));
  }
};

exports.getAll = async (req, res, next) => {
  const genres = await Genre.getAll();
  res.status(200).json(genres);
};
exports.getOne = async (req, res, next) => {
  const requestedId = req.params.id;
  const genre = await Genre.getOne(requestedId);
  if (genre) {
    const movies = await genre.getMovies({ attributes: ["id"] });
    let moviesResource = [];
    if (movies.length > 0) {
      moviesResource = movies.map((movie) => {
        return { title: movie.name, src: `/movies/${movie.id}` };
      });
    }
    return res
      .status(200)
      .json({ ...genre.dataValues, movies: moviesResource });
  } else return next(normalizeError("Not found", 404));
};
exports.put = async (req, res, next) => {
  const requestedId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.array({ onlyFirstError: true })[0];
    return next(normalizeError(firstError.msg, 400));
  } else {
    try {
      const genreToUpdate = await Genre.getOne(requestedId);
      if (!genreToUpdate) return next(normalizeError("Not found", 404));
      const { name } = req.body;
      const imageFile = req.file.filename;
      if (!imageFile) return next(normalizeError("Invalid file", 400));
      genreToUpdate.name = name;
      genreToUpdate.image = `/images/${imageFile}`;
      if (await genreToUpdate.save())
        return res.status(200).json({ status: "Genre successfully updated" });
    } catch (err) {
      console.log(err);
      return next(normalizeError(err.message, 500));
    }
  }
};
exports.delete = async (req, res, next) => {
  const requestedId = req.params.id;
  try {
    const genreToUpdate = await Genre.getOne(requestedId);
    if (!genreToUpdate) {
      return next(normalizeError("Not found", 404));
    }
    await genreToUpdate.destroy();
    return res.status(200).json({ status: "Genre was successfully deleted" });
  } catch (err) {
    return next(normalizeError(err.message, 500));
  }
};
