const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuServiciosPaciente = mongoose.model(
  "menu_servicios_paciente",
  new Schema({
    icono: String,
    title: String,
    subtitle: String,
    tipo: String,
    habilitado: Boolean,
    posicion: Number,
    implementado: Boolean,
    mensajeImplementado: String,
  }),
  "menu_servicios_pacientes"
);

module.exports = MenuServiciosPaciente;
