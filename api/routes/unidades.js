const express = require("express");
const unidadesController = require("../controllers/unidadesController");
const { isAuthenticated, hasRole } = require("../middleware/authInterno");
const {
  unidadExists,
  requireNewImages,
  invalidImages,
  validateCreate,
  validateUpdate,
} = require("../middleware/validarUnidades");

const router = express.Router();

router.get("", unidadesController.get);

router.post(
  "",
  isAuthenticated,
  hasRole(["user", "admin"]),
  requireNewImages,
  invalidImages,
  validateCreate,
  unidadesController.create
);

router.put(
  "/:_id",
  isAuthenticated,
  hasRole(["user", "admin"]),
  unidadExists,
  invalidImages,
  validateUpdate,
  unidadesController.update
);

router.delete(
  "/:_id",
  isAuthenticated,
  hasRole(["user", "admin"]),
  unidadExists,
  unidadesController.delete
);

module.exports = router;
