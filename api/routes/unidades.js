const express = require("express");
const unidadesController = require("../controllers/unidadesController");

const router = express.Router();

router.get("", unidadesController.get);

module.exports = router;
