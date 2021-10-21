const express = require("express");
const ubicacionesController = require("../controllers/ubicacionesController");

const router = express.Router();

router.get("/", ubicacionesController.get);

module.exports = router;
