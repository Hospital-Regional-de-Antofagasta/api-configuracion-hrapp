const express = require("express");
const versionesController = require("../controllers/versionesController");

const router = express.Router();

router.post("/revisar-si-version-deprecada", versionesController.checkSiVersionDeprecada);

module.exports = router;
