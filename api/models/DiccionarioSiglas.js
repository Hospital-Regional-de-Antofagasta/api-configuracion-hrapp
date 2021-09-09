const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiccionarioSiglas = mongoose.model(
  "diccionario_siglas",
  new Schema([
    {
      siglaComparacion: String,
      sigla: String,
    },
  ]),
  "diccionario_siglas"
);

module.exports = DiccionarioSiglas;
