const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfigApiConfiguracion = mongoose.model(
  "config_api_configuracion",
  new Schema({
    mensajes: {
      forbiddenAccess: {
        titulo: String,
        mensaje: String,
        color: String,
        icono: String,
      },
      serverError: {
        titulo: String,
        mensaje: String,
        color: String,
        icono: String,
      },
    },
    version: Number,
  }),
  "config_api_configuracion"
);

module.exports = ConfigApiConfiguracion;
