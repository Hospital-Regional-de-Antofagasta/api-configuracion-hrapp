const ConfigApiDatosExternos = require("./models/ConfigApiDatosExternos");

let mensajes = {
  forbiddenAccess: "Su sesión ha expirado.",
  serverError: "Se produjo un error.",
};

const loadConfig = async () => {
  try {
    const config = await ConfigApiMenu.findOne({ version: 1 }).exec();
    mensajes = config.mensajes;
  } catch (error) {}
};

module.exports = {
  loadConfig,
  mensajes,
};
