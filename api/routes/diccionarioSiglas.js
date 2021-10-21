const express = require("express");
const diccionarioSiglasController = require("../controllers/diccionarioSiglasController");

const router = express.Router();

router.get("", diccionarioSiglasController.get);

module.exports = router;
