const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { regex } = require("../utils/regexValidaciones");

const MenuUnidades = mongoose.model(
  "menu_unidades",
  new Schema({
    icono: {
      type: String,
      trim: true,
      required: [true, "El ícono es obligatorio."],
      match: [
        regex.correlativo,
        "El ícono ingresado {VALUE} no tiene el formato correcto.",
      ],
      maxLength: [25, "El ícono no puede superar los 25 caracteres."],
      minLength: [1, "El ícono es obligatorio."],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "El título es obligatorio."],
      unique: true,
      match: [
        regex.nombre,
        "El título ingresado {VALUE} no tiene el formato correcto.",
      ],
      maxLength: [50, "El título no puede superar los 50 caracteres."],
      minLength: [1, "El título es obligatorio."],
    },
    subtitle: {
      type: String,
      trim: true,
      required: [true, "El subtítulo es obligatorio."],
      match: [
        regex.texto,
        "El subtítulo ingresado {VALUE} no tiene el formato correcto.",
      ],
      maxLength: [150, "El subtítulo no puede superar los 150 caracteres."],
      minLength: [1, "El subtítulo es obligatorio."],
    },
    tipo: {
      type: String,
      trim: true,
      required: [true, "El tipo es obligatorio."],
      match: [
        regex.correlativo,
        "El tipo ingresado {VALUE} no tiene el formato correcto.",
      ],
      maxLength: [25, "El tipo no puede superar los 25 caracteres."],
      minLength: [1, "El tipo es obligatorio."],
    },
    habilitado: {
      type: Boolean,
      required: [true, "El habilitado es obligatorio."],
    },
    posicion: {
      type: Number,
      required: [true, "La posición es obligatoria."],
      max: [99, "La posición no puede ser mayor a 99"],
      min: [1, "La posición no puede ser menor a 0"],
    },
    implementado: Boolean,
    mensajeImplementado: { type: String, trim: true },
    version: Number,
    redirecTo: { type: String, trim: true },
  }),
  "menu_unidades"
);

module.exports = MenuUnidades;
