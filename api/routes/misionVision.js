const express = require("express");
const misionVisionController = require("../controllers/misionVisionController");

const router = express.Router();

router.get("", misionVisionController.get);

module.exports = router;
