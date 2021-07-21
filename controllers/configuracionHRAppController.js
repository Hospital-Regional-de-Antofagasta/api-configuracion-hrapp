const ConfiguracionHRApp = require("../models/ConfiguracionHRApp");
const { getMensajes } = require("../api/config");

exports.getConfiguracion = async (req, res) => {
  try {
    const configuracionHRApp = await ConfiguracionHRApp.findOne().exec();
    res.status(200).send(configuracionHRApp);
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
