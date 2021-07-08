const ConfigApiConfiguracion = require("../models/ConfigApiConfiguracion");

let mensajes = {
  forbiddenAccess: "Su sesión ha expirado.",
  serverError: "Se produjo un error.",
};

const loadConfig = async () => {
  try {
    const config = await ConfigApiConfiguracion.findOne({ version: 1 }).exec();
    mensajes = config.mensajes;
  } catch (error) {}
};

module.exports = {
  loadConfig,
  mensajes,
};
