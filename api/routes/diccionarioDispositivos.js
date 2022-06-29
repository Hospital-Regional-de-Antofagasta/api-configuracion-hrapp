const express = require("express");
const diccionarioDispositivosController = require("../controllers/diccionarioDispositivosController");

const router = express.Router();

router.get("/:idDispositivo", diccionarioDispositivosController.get);

module.exports = router;
