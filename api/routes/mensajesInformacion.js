const express = require("express");
const mensajesInformacionController = require("../controllers/mensajesInformacionController");

const router = express.Router();

router.get("/", mensajesInformacionController.get);

module.exports = router;
