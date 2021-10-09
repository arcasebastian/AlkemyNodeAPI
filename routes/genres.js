const express = require("express");
const controller = require("../controllers/genres");
const { body } = require("express-validator");
const sequelize = require("../models/sequelize");
const Genre = sequelize.models.genre;
const { isAuth } = require("../middleware/isAuthorized");
const router = express.Router();
router.post(
  "/",
  isAuth,
  [
    body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("A genre name is required")
      .custom((value, { req }) => {
        return Genre.findOne({ where: { name: value } }).then((genre) => {
          console.log(value);
          if (genre) return Promise.reject("Genre is already registered");
          return Promise.resolve();
        });
      }),
  ],
  controller.post
);
router.get("/", isAuth, controller.getAll);
router.get("/:id", isAuth, controller.getOne);
router.put(
  "/:id",
  isAuth,
  [
    body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("A genre name is required"),
  ],
  controller.put
);
router.delete("/:id", isAuth, controller.delete);
module.exports = router;
