const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Unidades = mongoose.model(
  "unidades",
  new Schema({
    nombre: String,
    descripcion: String,
    servicios: [{ nombre: String }],
    referencia: String,
    imagen: {
      src: String,
      srcset: [String],
      alt: String,
    },
    tipo: String,
    habilitado: Boolean,
    posicion: Number,
    version: Number,
    atencion: [
      {
        nombreHorario: String,
        tipoAtencion: String,
        atencionFeriados: Boolean,
        horarioAtencion: [
          {
            diaAtencion: { diaApertura: String, diaCierre: String },
            horaAtencion: [{ horaApertura: String, horaCierre: String }],
          },
        ],
        contactos: {
          telefonos: [{ numero: String }],
          correos: [{ correo: String }],
        },
      },
    ],
  }),
  "unidades"
);

module.exports = Unidades;
