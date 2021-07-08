const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfigApiConfiguracion = mongoose.model(
  "config_api_configuracion",
  new Schema({
    mensajes: {
      forbidenAccess: String,
      serverError: String,
      version: Number,
    },
  })
);

module.exports = ConfigApiConfiguracion;
