const express = require("express");
const controller = require("../controllers/movies");
const { body, param, query } = require("express-validator");
const sequelize = require("../models/sequelize");
const Movie = sequelize.models.movie;
const { isAuth } = require("../middleware/isAuthorized");
const { isInt } = require("validator");
const router = express.Router();
const validationChain = [
  body(["title", "rating", "releaseDate"])
    .not()
    .isEmpty()
    .withMessage("title, rating and releaseDate are required"),
  body("rating", "Rating must be a number between 0 and 5").isInt({
    min: 0,
    max: 5,
  }),
  body("releaseDate", "Release date must follow the format: DD/MM/YYYY").isDate(
    { format: "DD/MM/YYYY" }
  ),
  body("genres")
    .optional()
    .custom((value) => {
      const arrayValues = value.split(",");
      for (let valueToCheck of arrayValues) {
        if (!isInt(valueToCheck)) {
          return Promise.reject(
            "Genres must be one or more ids (Integers), separated by comas"
          );
        }
      }
      return Promise.resolve();
    }),
];
router.post(
  "/",
  isAuth,
  validationChain,
  body("title").custom((value, { req }) => {
    return Movie.findOne({ where: { title: value } }).then((movie) => {
      if (movie) return Promise.reject("Movie is already registered");
      return Promise.resolve();
    });
  }),
  controller.post
);
router.get(
  "/",
  isAuth,
  [
    query("title", "Title query param must be a string.")
      .optional()
      .notEmpty()
      .isString(),
    query("genre", "Genre filter param must be a integer.")
      .optional()
      .notEmpty()
      .isInt(),
    query("order", "Order value must be ASC or DESC")
      .optional()
      .isString()
      .isIn(["ASC", "DESC"]),
  ],
  controller.getAll
);
router.get(
  "/:id",
  isAuth,
  param("id", "Resource identifier must be an integer.").isInt(),
  controller.getOne
);
router.put(
  "/:id",
  isAuth,
  param("id", "Resource identifier must be an integer.").isInt(),
  validationChain,
  body("title").custom((value, { req }) => {
    return Movie.findOne({ where: { title: value } }).then((movie) => {
      if (movie && movie.id != req.params.id)
        return Promise.reject(
          "Movie name is already registered and cant be changed"
        );
      return Promise.resolve();
    });
  }),
  controller.put
);
router.delete(
  "/:id",
  isAuth,
  param("id", "Resource identifier must be an integer.").isInt(),
  controller.delete
);
module.exports = router;
