const ConfigApiConfiguracion = require("./models/ConfigApiConfiguracion");

const mensajesPorDefecto = {
  forbiddenAccess: {
    titulo: "Acceso Denegado",
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
  remindUpdate: {
    titulo: "Nueva Versión",
    mensaje:
      "Hay una nueva versión de la aplicación y es necesario actualizarla.",
    color: "",
    icono: "face-surprise",
  },
  insufficientPermission: {
    titulo: "Acceso Denegado",
    mensaje: "No tiene los permisos para realizar esta acción.",
    color: "",
    icono: "",
  },
  badRequest: {
    titulo: "Datos inválidos",
    mensaje: "Los datos enviados son inválidos.",
    color: "",
    icono: "",
  },
  created: {
    titulo: "Elemento Creado",
    mensaje: "El elemento fue creado con éxito.",
    color: "",
    icono: "",
  },
  success: {
    titulo: "Acción Realizada",
    mensaje: "La acción fue realizada con éxito.",
    color: "",
    icono: "",
  },
  notFound: {
    titulo: "Elemento No Encontrado",
    mensaje: "El elemento no fue encontrado.",
    color: "",
    icono: "",
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
