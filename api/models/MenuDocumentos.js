const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuDocumentos = mongoose.model(
  "menu_documento",
  new Schema(
    {
      icono: String,
      title: String,
      subtitle: String,
      tipo: String,
      habilitado: Boolean,
      posicion: Number,
      implementado: Boolean,
      mensajeImplementado: String,
      version: Number,
    },
    { timestamps: true }
  ),
  "menu_documentos"
);

module.exports = MenuDocumentos;
