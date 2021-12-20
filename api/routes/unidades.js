const express = require("express");
const unidadesController = require("../controllers/unidadesController");
const { isAuthenticated, hasRole } = require("../middleware/authInterno");
const {
  requiredData,
  invalidData,
  elementExists,
  invalidImages,
} = require("../middleware/validarUnidades");

const router = express.Router();

router.get(
  "",
  unidadesController.get
);

router.post(
  "",
  isAuthenticated,
  hasRole(["user", "admin"]),
  requiredData,
  invalidData,
  invalidImages,
  unidadesController.create
);

router.put(
  "/:_id",
  isAuthenticated,
  hasRole(["user", "admin"]),
  elementExists,
  requiredData,
  invalidData,
  invalidImages,
  unidadesController.update
);

router.delete(
  "/:_id",
  isAuthenticated,
  hasRole(["user", "admin"]),
  elementExists,
  unidadesController.delete
);

module.exports = router;
