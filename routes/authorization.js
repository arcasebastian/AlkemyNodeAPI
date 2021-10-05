const express = require("express");
const controller = require("../controllers/authorization");
const router = express.Router();

const registerMethodsAllowed = ["PUT"];
const loginMethodsAllowed = ["POST"];

router.use("/register", (req, res, next) => {
  if (registerMethodsAllowed.includes(req.method)) return next();
  res.status(405).json({ error: "Method not allowed", httpCode: 405 });
});
router.use("/login", (req, res, next) => {
  if (loginMethodsAllowed.includes(req.method)) return next();
  res.status(405).json({ error: "Method not allowed", httpCode: 405 });
});
router.put("/register", controller.register);
router.post("/login", controller.login);

module.exports = router;
