const express = require("express");
const controller = require("../controllers/genres");
const { body } = require("express-validator");
const Genre = require("../models/Genre");
const router = express.Router();
router.post(
  "/",
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
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.put(
  "/:id",
  [
    body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("A genre name is required"),
  ],
  controller.put
);
router.delete("/:id", controller.delete);
module.exports = router;
