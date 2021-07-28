const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuInicio = mongoose.model(
  "menu_inicio",
  new Schema({
    icono: String,
    title: String,
    subtitle: String,
    redirecTo: String,
    habilitado: Boolean,
    tipo: String,
    posicion: Number,
    implementado: Boolean,
    mensajeImplementado: String,
    claveUnica: Boolean,
    version: Number,
  }),
  "menu_inicio"
);

module.exports = MenuInicio;
