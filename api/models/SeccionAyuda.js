const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeccionAyuda = mongoose.model(
  "seccion_ayuda",
  new Schema(
    {
      titulo: String,
      preguntas: [
        {
          texto: String,
          slide: Number,
        },
      ],
      respuestas: [String],
      icono: String,
      pagina: String,
      posicion: Number,
      habilitado: Boolean,
      version: Number,
    },
    { timestamps: true }
  ),
  "seccion_ayuda"
);

module.exports = SeccionAyuda;
