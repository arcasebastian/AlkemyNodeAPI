const express = require("express");
const controller = require("../controllers/movies");
const { body } = require("express-validator");
const Movie = require("../models/Movie");
const { isAuth } = require("../middleware/isAuthorized");
const router = express.Router();

router.post(
  "/",
  isAuth,
  [
    body(["title", "rating", "releaseDate"])
      .not()
      .isEmpty()
      .withMessage("title, rating and releaseDate are required"),
    body("rating", "Rating must be a number between 0 and 5").isInt({
      min: 0,
      max: 5,
    }),
    body(
      "releaseDate",
      "Release date must follow the format: DD/MM/YYYY"
    ).isDate({ format: "DD/MM/YYYY" }),
    body("characters").optional(),
    body("genres").optional(),
  ],
  controller.post
);
router.get("/", isAuth, controller.getAll);
router.get("/:id", isAuth, controller.getOne);
router.put(
  "/:id",
  isAuth,
  [
    body(["title", "rating", "releaseDate"])
      .not()
      .isEmpty()
      .withMessage("title, rating and releaseDate are required"),
    body("rating", "Rating must be a number between 0 and 5").isInt({
      min: 0,
      max: 5,
    }),
    body(
      "releaseDate",
      "Release date must follow the format: DD/MM/YYYY"
    ).isDate({ format: "DD/MM/YYYY" }),
    body("characters").optional(),
    body("genres").optional(),
  ],
  controller.put
);
router.delete("/:id", isAuth, controller.delete);
module.exports = router;
