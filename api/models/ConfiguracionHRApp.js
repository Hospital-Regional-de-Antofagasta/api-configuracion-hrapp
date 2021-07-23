const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfiguracionHRApp = mongoose.model(
  "configuracion_hrapp",
  new Schema({
    funcionalidadesHabilitadas: {
      horasMedicas: {
        solicitudAnular: Boolean,
        solicitudCambiar: Boolean,
      },
      horasExamenes: {
        solicitudAnular: Boolean,
        solicitudCambiar: Boolean,
      },
    },
    parametrosEndpoints: {
      documentosPacientes: {
        cantidadAObtener: Number,
      },
    },
    textosApp: {
      nombreApp: String,
      mensajeBienvenida: String,
    },
  }),
  "configuracion_hrapp"
);

module.exports = ConfiguracionHRApp;
