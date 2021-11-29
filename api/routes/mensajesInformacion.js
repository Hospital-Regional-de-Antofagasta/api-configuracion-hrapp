const express = require("express");
const mensajesInformacionController = require("../controllers/mensajesInformacionController");
const { isAuthenticated, hasRole } = require("../middleware/authInterno");
const { invalidData, requiredData, elementExists } = require("../middleware/validarMensajesInformacion");

const router = express.Router();

router.get("/", mensajesInformacionController.get);

router.put(
  "/",
  isAuthenticated,
  hasRole(["user", "admin"]),
  elementExists,
  requiredData,
  invalidData,
  mensajesInformacionController.updateMany
);

module.exports = router;
