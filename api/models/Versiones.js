const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Versiones = mongoose.model(
  "versiones",
  new Schema(
    {
      version: String,
      recordarActualizacion: Boolean,
      deprecada: Boolean,
    },
    { timestamps: true }
  ),
  "versiones"
);

module.exports = Versiones;
