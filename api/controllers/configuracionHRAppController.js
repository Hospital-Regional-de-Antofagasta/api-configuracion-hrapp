const ConfiguracionHRApp = require("../models/ConfiguracionHRApp");
const { getMensajes } = require("../config");

exports.getConfiguracion = async (req, res) => {
  try {
    const configuracionHRApp = await ConfiguracionHRApp.findOne({
      version: 1,
    }).exec();
    res.status(200).send(configuracionHRApp);
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
