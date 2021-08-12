const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeccionAyuda = mongoose.model(
  "seccion_ayuda",
  new Schema({
    titulo: String,
    preguntas: [
      {
        texto: String,
        slide: Number,
      },
    ],
    respuestas: [String],
    icono: String,
    tipo: String,
    posicion: Number,
    habilitado: Boolean,
    version: Number,
  }),
  "seccion_ayuda"
);

module.exports = SeccionAyuda;
