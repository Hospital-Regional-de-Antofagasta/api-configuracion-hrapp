const express = require("express");
const seccionAyudaController = require("../controllers/seccionAyudaController");

const router = express.Router();

router.get("", seccionAyudaController.get);

module.exports = router;
