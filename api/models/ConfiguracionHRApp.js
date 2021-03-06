const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfiguracionHRApp = mongoose.model(
  "configuracion_hrapp",
  new Schema(
    {
      version: Number,
    },
    { strict: false },
    { timestamps: true }
  ),
  "configuracion_hrapp"
);

module.exports = ConfiguracionHRApp;
