const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfigApiDatosExternos = mongoose.model(
  "config_api_datos_externo",
  new Schema({
    mensajes: {
      forbidenAccess: String,
      serverError: String,
      version: Number,
    },
  })
);

module.exports = ConfigApiDatosExternos;
