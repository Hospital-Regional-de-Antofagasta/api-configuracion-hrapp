const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiccionarioDispositivos = mongoose.model(
  "diccionario_dispositivos",
  new Schema(
    [
      {
        id: String,
        name: String,
      },
    ],
    { timestamps: true }
  ),
  "diccionario_dispositivos"
);

module.exports = DiccionarioDispositivos;
