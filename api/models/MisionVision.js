const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MisionVision = mongoose.model(
  "mision_vision",
  new Schema({
    mision: {
      titulo: String,
      texto: String,
      icono: String,
    },
    vision: {
      titulo: String,
      texto: String,
      icono: String,
    },
    version: Number,
  }),
  "mision_vision"
);

module.exports = MisionVision;