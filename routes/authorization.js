const express = require("express");
const controller = require("../controllers/authorization");
const { body } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

const registerMethodsAllowed = ["PUT"];
const loginMethodsAllowed = ["POST"];

router.use("/register", (req, res, next) => {
  if (registerMethodsAllowed.includes(req.method)) return next();
  return res.status(405).json({ error: "Method not allowed", httpCode: 405 });
});
router.use("/login", (req, res, next) => {
  if (loginMethodsAllowed.includes(req.method)) return next();
  return res.status(405).json({ error: "Method not allowed", httpCode: 405 });
});
router.put(
  "/register",
  [
    body(["name", "email", "password"])
      .exists()
      .withMessage("name, email and password are required"),
    body("email")
      .isEmail()
      .withMessage("Email is invalid")
      .bail()
      .custom((value, { req }) => {
        return User.findByEmail(value).then((user) => {
          if (user) return Promise.reject("Email is already registered");
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  controller.register
);
router.post(
  "/login",
  [
    body(["email", "password"]).exists(),
    body("email").isEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  controller.login
);

module.exports = router;
