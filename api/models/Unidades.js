const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Unidades = mongoose.model(
  "unidades",
  new Schema({
    nombreUnidad: String,
    descripcion: String,
    carteraServicios: [String],
    horarioAtencion: [
      {
        hora: {
          apertura: String,
          cierre: String,
        },
        dia: {
          apertura: String,
          cierre: String,
        },
      },
    ],
    contacto: {
      fono: [String],
      correo: [String],
    },
    referencia: String,
    imagen: String,
    tipo: String,
    habilitado: Boolean,
    posicion: Number,
    version: Number,
  }),
  "unidades"
);

module.exports = Unidades;
