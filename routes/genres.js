const express = require("express");
const controller = require("../controllers/genres");
const { body, param } = require("express-validator");
const sequelize = require("../models/sequelize");
const Genre = sequelize.models.genre;
const { isAuth } = require("../middleware/isAuthorized");
const router = express.Router();

const validationChain = [
  body(
    "name",
    "A genre name is required and must be at least 3 characters long"
  )
    .trim()
    .isLength({ min: 3 }),
];

router.post(
  "/",
  isAuth,
  validationChain,
  body("name").custom((value, { req }) => {
    return Genre.findOne({ where: { name: value } }).then((genre) => {
      if (genre) return Promise.reject("Genre is already registered");
      return Promise.resolve();
    });
  }),
  controller.post
);
router.get("/", isAuth, controller.getAll);
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
    return Genre.findOne({ where: { name: value } }).then((genre) => {
      if (genre && genre.id != req.params.id)
        return Promise.reject(
          "Genre name is already registered and cant be changed"
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
