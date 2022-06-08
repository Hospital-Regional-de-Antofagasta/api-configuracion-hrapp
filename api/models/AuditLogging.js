const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actions = [
  "POST /v1/configuracion-hrapp/unidades",
  "PUT /v1/configuracion-hrapp/unidades/:_id",
  "DELETE /v1/configuracion-hrapp/unidades/:_id",
  "POST /v1/configuracion-hrapp/menu/unidades",
  "PUT /v1/configuracion-hrapp/menu/unidades/:_id",
  "DELETE /v1/configuracion-hrapp/menu/unidades/:_id",
  "PUT /v1/configuracion-hrapp/mensajes-informacion",
];

const UsuariosInternos = mongoose.model(
  "audit_logging",
  new Schema(
    {
      userName: { type: String, required: true },
      userId: { type: String, required: true },
      action: { type: String, required: true, enum: actions },
      affectedData: { type: Object },
    },
    { timestamps: true }
  ),
  "audit_logging"
);

module.exports = UsuariosInternos;
