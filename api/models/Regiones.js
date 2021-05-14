const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Region = mongoose.model(
  "region",
  new Schema({
    codigoRegion: String,
    nombre: String,
  }),
  "regiones"
);

module.exports = Region;
