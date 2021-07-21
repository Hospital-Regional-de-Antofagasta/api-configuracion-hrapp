const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuUnidades = mongoose.model(
  "menu_unidades",
  new Schema({
    icono: String,
    title: String,
    subtitle: String,
    tipo: String,
    habilitado: Boolean,
    posicion: Number,
    implementado: Boolean,
    mensajeImplementado: String,
    version: Number,
  }),
  "menu_unidades"
);

module.exports = MenuUnidades;
