const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const env = require("../env/env.json");
const User = require("../models/User");
const { normalizeError } = require("../util/normalizeError");

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0];
    const errorCode = firstError.msg.includes("already") ? 409 : 400;
    return next(normalizeError(firstError.msg, errorCode));
  }
  const { name, email, password } = req.body;
  const newUser = new User({
    name: name,
    password: await bcrypt.hash(password, 12),
    email: email,
    status: 1,
  });
  if (await newUser.save()) {
    res.status(201).json({ status: "User registered successfully" });
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        env.jwtSecret,
        { expiresIn: "2h" }
      );
      return res.status(200).json({ access_token: token, username: user.name });
    }
  }
  return next(normalizeError("Invalid email or password", 401));
};
