const Versiones = require("../models/Versiones");
const { getMensajes } = require("../config");

exports.checkSiVersionDeprecada = async (req, res) => {
  try {
    const filter = { version: req.body.appVersion };
    const version = await Versiones.findOne(filter).exec();
    if (!version) {
      return res.status(200).send({
        estado: "NO_ENCONTRADA",
        respuesta: await getMensajes("versionNotFound"),
      });
    }
    if (version.deprecada) {
      return res.status(200).send({
        estado: "DEPRECADA",
        respuesta: await getMensajes("deprecatedVersion"),
      });
    }
    if (version.recordarActualizacion) {
      return res.status(200).send({
        estado: "RECORDAR_ACTUALIZACION",
        respuesta: await getMensajes("remindUpdate"),
      });
    }
    res.status(200).send({
      estado: "OK",
      respuesta: {},
    });
  } catch (error) {
    if (process.env.NODE_ENV === "dev")
      return res.status(500).send({
        respuesta: await getMensajes("serverError"),
        detalles_error: {
          nombre: error.name,
          mensaje: error.message,
        },
      });
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
