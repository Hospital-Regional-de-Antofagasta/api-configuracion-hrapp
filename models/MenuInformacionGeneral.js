const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuInformacionGeneral = mongoose.model(
  "menu_informacion_general",
  new Schema({
    icono: String,
    title: String,
    subtitle: String,
    tipo: String,
    habilitado: Boolean,
    implementado: Boolean,
    mensajeImplementado: String,
    posicion: Number,
    version: Number,
  }),
  "menu_informacion_general"
);

module.exports = MenuInformacionGeneral;