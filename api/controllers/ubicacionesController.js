const Regiones = require("../models/Regiones");
const Ciudades = require("../models/Ciudades");
const { getMensajes } = require("../config");

exports.get = async (req, res) => {
  try {
    const ubicaciones = await Promise.all([
      Regiones.find().exec(),
      Ciudades.find().exec(),
    ]);
    res.status(200).send(ubicaciones);
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
