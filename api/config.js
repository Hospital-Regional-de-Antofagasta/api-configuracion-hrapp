const ConfigApiConfiguracion = require("./models/ConfigApiConfiguracion");

const mensajesPorDefecto = {
  forbiddenAccess: {
    titulo: "Alerta",
    mensaje: "Su sesión ha expirado.",
    color: "",
    icono: "",
  },
  serverError: {
    titulo: "Alerta",
    mensaje: "Ocurrió un error inesperado.",
    color: "",
    icono: "",
  },
  versionNotFound: {
    titulo: "Alerta",
    mensaje: "No se pudo validar la versión de la aplicación.",
    color: "",
    icono: "",
  },
  versionGone: {
    titulo: "Nueva Versión",
    mensaje: "Hay una nueva versión de la aplicación y es necesario actualizarla.",
    color: "",
    icono: "face-surprise",
  },
};

exports.getMensajes = async (tipo) => {
  try {
    const { mensajes } = await ConfigApiConfiguracion.findOne({
      version: 1,
    }).exec();
    if (mensajes) {
      return mensajes[tipo];
    }
    return mensajesPorDefecto[tipo];
  } catch (error) {
    return mensajesPorDefecto[tipo];
  }
};
