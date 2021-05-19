const express = require("express");
const ubicacionesController = require("../controllers/ubicacionesController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/", isAuthenticated, ubicacionesController.get);

module.exports = router;
