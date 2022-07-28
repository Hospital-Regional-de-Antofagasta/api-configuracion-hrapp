const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiccionarioSiglas = mongoose.model(
  "diccionario_siglas",
  new Schema(
    [
      {
        siglaComparacion: String,
        sigla: String,
      },
    ],
    { timestamps: true }
  ),
  "diccionario_siglas"
);

module.exports = DiccionarioSiglas;
