const express = require("express");
const controller = require("../controllers/authorization");
const router = express.Router();

const registerMethodAllowed = ['PUT']
const loginMethodAllowed = ['POST']

router.use("/register", (req, res, next) => {
  if(registerMethodAllowed.includes(req.method))
    return next();
  res.status(405).json({ error: "Method not allowed", httpCode: 405 });
});

router.put("/register", controller.register);
router.post("/login", controller.login);

module.exports = router;
