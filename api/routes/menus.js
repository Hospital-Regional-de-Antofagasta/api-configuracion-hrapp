const express = require("express");
const menuController = require("../controllers/menusController");
const { isAuthenticated, hasRole } = require("../middleware/authInterno");
const { invalidaData, requiredData, itemExists } = require("../middleware/validarMenuUnidades");

const router = express.Router();

router.get("/servicios-paciente", menuController.getServiciospaciente);

router.get("/inicio", menuController.getInicio);

router.get("/documentos", menuController.getDocumentos);

router.get("/informacion-general", menuController.getInformacionGeneral);

router.get("/unidades", menuController.getItemsUnidades);

router.post(
  "/unidades",
  isAuthenticated,
  hasRole(["user", "admin"]),
  requiredData,
  invalidaData,
  menuController.createItemUnidad
);

router.put(
  "/unidades/:_id",
  isAuthenticated,
  hasRole(["user", "admin"]),
  itemExists,
  invalidaData,
  menuController.updateItemUnidad
);

router.delete(
  "/unidades/:_id",
  isAuthenticated,
  hasRole(["user", "admin"]),
  itemExists,
  menuController.deleteItemUnidad
);

router.get("/tabs", menuController.getTabs);

router.get("/carga-inicial", menuController.getMenusCargaInicio);

module.exports = router;
