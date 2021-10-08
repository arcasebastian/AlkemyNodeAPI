const express = require("express");
const controller = require("../controllers/characters");
const { body } = require("express-validator");
const Character = require("../models/Character");
const { isAuth } = require("../middleware/isAuthorized");
const router = express.Router();

router.post("/", isAuth, controller.post);
router.get("/", isAuth, controller.getAll);
router.get("/:id", isAuth, controller.getOne);
router.put("/:id", isAuth, controller.put);
router.delete("/:id", isAuth, controller.delete);
module.exports = router;
