const express = require("express");
const controller = require("../controllers/characters");
const { body } = require("express-validator");
const Character = require("../models/Character");
const router = express.Router();

router.post("/", controller.post);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.put("/:id", controller.put);
router.delete("/:id", controller.delete);
module.exports = router;
