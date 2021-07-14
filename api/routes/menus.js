const express = require("express");
const menuController = require("../controllers/menusController");
const { isAuthenticated } = require("../../middleware/auth");

const router = express.Router();

router.get("/servicios-paciente", menuController.getServiciospaciente);

router.get("/inicio", menuController.getInicio);

router.get("/documentos", isAuthenticated, menuController.getDocumentos);

module.exports = router;
