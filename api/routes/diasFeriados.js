const express = require("express");
const diasFeriadosController = require("../controllers/diasFeriadosController");

const router = express.Router();

router.get("/", diasFeriadosController.get);

module.exports = router;
