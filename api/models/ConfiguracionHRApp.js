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
    imagenesApp: {
      logoHrapp: {
        src: String,
        srcset: [String],
        alt: String,
      },
      inicio: {
        src: String,
        srcset: [String],
        alt: String,
      },
      informacionGeneral: {
        src: String,
        srcset: [String],
        alt: String,
      },
      serviciosPaciente: {
        src: String,
        srcset: [String],
        alt: String,
      },
      misionVision: {
        src: String,
        srcset: [String],
        alt: String,
      },
      menuPrestaciones: {
        src: String,
        srcset: [String],
        alt: String,
      },
    },
  }),
  "configuracion_hrapp"
);

module.exports = ConfiguracionHRApp;
