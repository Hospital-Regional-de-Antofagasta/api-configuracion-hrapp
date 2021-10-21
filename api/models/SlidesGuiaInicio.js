const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SlidesGuiaInicio = mongoose.model(
  "slides_guia_inicio",
  new Schema({
    titulo: {
      texto: String,
      color: String,
      tamanio: String,
      alineamiento: String,
      bold: Boolean,
    },
    imagen: {
      src: String,
      srcset: [String],
      alt: String,
    },
    icono: {
      icono: String,
      color: String,
    },
    subtitulo: {
      texto: String,
      color: String,
      tamanio: String,
      alineamiento: String,
      bold: Boolean,
    },
    contenido: {
      texto: {
        texto: String,
        color: String,
        tamanio: String,
        alineamiento: String,
        bold: Boolean,
      },
      lista: [
        {
          icono: {
            icono: String,
            color: String,
            tamanio: String,
            alineamiento: String,
          },
          texto: {
            texto: String,
            color: String,
            tamanio: String,
            alineamiento: String,
            bold: Boolean,
          },
        },
      ],
    },
    boton: {
      texto: String,
      icono: String,
      color: String,
      tamanio: String,
      alineamiento: String,
      bold: Boolean,
    },
    animacion: Boolean,
    habilitado: Boolean,
    posicion: Number,
    version: Number,
  }),
  "slides_guia_inicio"
);

module.exports = SlidesGuiaInicio;
