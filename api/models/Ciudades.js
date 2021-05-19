const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Ciudad = mongoose.model(
  "ciudad",
  new Schema({
    codigoRegion: String,
    codigoProvincia: String,
    codigoCiudad: String,
    nombre: String,
  }),
  "ciudades"
);

module.exports = Ciudad;
