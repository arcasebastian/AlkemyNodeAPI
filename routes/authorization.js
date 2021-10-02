const express = require("express");
const controller = require("../controllers/authorization");
const router = express.Router();

router.put("/register", controller.register);

router.use("/register", (req, res) => {
  res.status(405).json({ error: "Method not allowed" });
});
module.exports = router;
