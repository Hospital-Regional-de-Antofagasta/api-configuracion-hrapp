const express = require("express");
const menuController = require("../../controllers/menusController");

const router = express.Router();

router.get("/servicios-paciente", menuController.getServiciospaciente);

router.get("/inicio", menuController.getInicio);

router.get("/documentos", menuController.getDocumentos);

router.get("/informacion-general", menuController.getInformacionGeneral);

router.get("/unidades", menuController.getUnidades);

router.get("/carga-inicial", menuController.getMenusCargaInicio);

module.exports = router;
