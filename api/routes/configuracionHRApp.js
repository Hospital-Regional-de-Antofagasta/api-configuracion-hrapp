const express = require("express");
const configuracionHRAppController = require("../controllers/configuracionHRAppController");

const router = express.Router();

router.get("", configuracionHRAppController.getConfiguracion);

module.exports = router;
