const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuServiciosPaciente = mongoose.model(
  "menu_servicios_pacientes",
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
  "menu_servicios_pacientes"
);

module.exports = MenuServiciosPaciente;
