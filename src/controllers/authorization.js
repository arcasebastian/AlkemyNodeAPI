const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../env/env.json");
const sequelize = require("../models/sequelize");
const User = sequelize.models.user;
const {
  normalizeError,
  checkValidationErrors,
} = require("../util/normalizeError");

exports.register = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError) return next(validationError);
  try {
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
  } catch (err) {
    return next(err.message, 500);
  }
};

exports.login = async (req, res, next) => {
  const validationError = checkValidationErrors(req);
  if (validationError)
    return next(normalizeError("Invalid email or password", 401));
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return next(normalizeError("Invalid email or password", 401));
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        env.jwtSecret,
        { expiresIn: env.tokenExpires }
      );
      return res.status(200).json({ access_token: token, username: user.name });
    }
    return next(normalizeError("Invalid email or password", 401));
  } catch (err) {
    return next(err.message, 500);
  }
};
