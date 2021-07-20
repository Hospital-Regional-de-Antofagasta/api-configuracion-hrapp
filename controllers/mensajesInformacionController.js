const MensajesInformacion = require("../models/MensajesInformacion");
const { getMensajes } = require("../api/config");

exports.get = async (req, res) => {
  try {
    const mensajesInformacion = await MensajesInformacion.find().exec();
    res.status(200).send(mensajesInformacion);
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
