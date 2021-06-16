const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuDocumentos = mongoose.model(
  "menu_documento",
  new Schema({
    icono: String,
    title: String,
    subtitle: String,
    tipo: String,
    habilitado: Boolean,
    posicion: Number,
    implementado: Boolean,
  }),
  "menu_documentos"
);

module.exports = MenuDocumentos;