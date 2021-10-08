const jwt = require("jsonwebtoken");
const env = require("../env/env.json");
const { normalizeError } = require("../util/normalizeError");
exports.isAuth = (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    return next(normalizeError("Not authorized", 405));
  }
  const token = authorization.split(" ")[1];
  let decodedAuthToken;
  try {
    decodedAuthToken = jwt.verify(token, env.jwtSecret);
  } catch (err) {
    return next(normalizeError("Not authorized", 405));
  }
  if (!decodedAuthToken) {
    return next(normalizeError("Not authorized", 405));
  }
  req.userId = decodedAuthToken.id;
  return next();
};
