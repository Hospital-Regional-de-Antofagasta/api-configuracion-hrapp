const MensajesInformacion = require("../models/MensajesInformacion");
const { getMensajes } = require("../config");

exports.get = async (req, res) => {
  try {
    const mensajesInformacion = await MensajesInformacion.find().exec();
    res.status(200).send(mensajesInformacion);
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
