const express = require("express");
const unidadesController = require("../controllers/unidadesController");
const { isAuthenticated, hasRole } = require("../middleware/authInterno");
const {
  requiredData,
  invalidaData,
  elementExists,
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
  invalidaData,
  unidadesController.create
);

router.put(
  "/:_id",
  isAuthenticated,
  hasRole(["user", "admin"]),
  elementExists,
  requiredData,
  invalidaData,
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
