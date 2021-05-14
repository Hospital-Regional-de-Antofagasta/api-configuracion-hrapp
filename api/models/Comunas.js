const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comuna = mongoose.model(
  "comuna",
  new Schema({
    codigoRegion: String,
    codigoProvincia: String,
    codigoCiudad: String,
    codigoComuna: String,
    nombre: String,
  }),
  "comunas"
);

module.exports = Comuna;
