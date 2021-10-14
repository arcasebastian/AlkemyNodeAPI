const express = require("express");
const { body, param, query } = require("express-validator");
const { isInt } = require("validator");

const { isAuth } = require("../middleware/isAuthorized");
const controller = require("../controllers/characters");
const sequelize = require("../models/sequelize");
const Character = sequelize.models.character;

const router = express.Router();
const validationChain = [
  body("name", "Name is required").trim().exists().isLength({ min: 1 }),
  body("age", "Age is required and must be a integer value.")
    .exists()
    .trim()
    .isInt(),
  body("weight", "Weight is required and must be a decimal value")
    .exists()
    .trim()
    .isDecimal(),
  body(
    "history",
    "History is required and must be between 10 to 300 characters long"
  )
    .exists()
    .trim()
    .isLength({ min: 10, max: 300 }),
  body("movies")
    .optional()
    .custom((value) => {
      const arrayValues = value.split(",");
      for (let valueToCheck of arrayValues) {
        if (!isInt(valueToCheck)) {
          return Promise.reject(
            "Movies must be one or more ids (Integers), separated by comas"
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
  body("name").custom((value, { req }) => {
    return Character.findOne({ where: { name: value } }).then((character) => {
      if (character)
        return Promise.reject("Character name is already registered");
      return Promise.resolve();
    });
  }),
  controller.post
);
router.get(
  "/",
  isAuth,
  [
    query("name", "Name search param must be a string.")
      .optional()
      .notEmpty()
      .isString(),
    query("age", "Age filter param must be a integer")
      .optional()
      .notEmpty()
      .isInt(),
    query("weight", "Weight filter param must be a decimal value")
      .optional()
      .notEmpty()
      .isDecimal(),
    query(
      "movies",
      "Movies filter values must be composed of integers separated by commas"
    )
      .optional()
      .notEmpty()
      .custom((values) => {
        for (let value of values.split(",")) {
          if (!isInt(value)) return Promise.reject();
        }
        return Promise.resolve();
      }),
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
  body("name").custom((value, { req }) => {
    return Character.findOne({ where: { name: value } }).then((character) => {
      if (character && character.id != req.params.id)
        return Promise.reject(
          "Character name is already registered and cant be changed"
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
