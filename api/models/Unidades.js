const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Unidades = mongoose.model(
  "unidades",
  new Schema({
    nombre: String,
    descripcion: String,
    servicios: [String],
    atenciones: [
      {
        nombre: String,
        horario: {
          nota: String,
          atiendeFeriados: Boolean,
          periodos: [
            {
              dias: {
                inicio: String,
                fin: String,
              },
              horas: [
                {
                  inicio: String,
                  fin: String,
                },
              ],
            },
          ],
        },
        contactos: {
          telefonos: [String],
          correos: [String],
        },
      },
    ],
    referencias: [
      {
        ubicacion: String,
        imagen: {
          src: String,
          alt: String,
          srcset: [String],
        },
      },
    ],
    tipo: String,
    habilitado: Boolean,
    posicion: Number,
    version: Number,
  }),
  "unidades"
);

module.exports = Unidades;
