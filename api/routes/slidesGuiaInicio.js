const express = require("express");
const slidesGuiaInicioController = require("../controllers/slidesGuiaInicioController");

const router = express.Router();

router.get("", slidesGuiaInicioController.get);

module.exports = router;
