const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MensajesInformacion = mongoose.model(
  "mensajes_informacion",
  new Schema(
    {
      pagina: String,
      texto: String,
      color: String,
    },
    { timestamps: true }
  ),
  "mensajes_informacion"
);
module.exports = MensajesInformacion;
