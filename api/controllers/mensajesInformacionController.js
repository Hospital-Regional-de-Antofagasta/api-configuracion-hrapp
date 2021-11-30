const MensajesInformacion = require("../models/MensajesInformacion");
const { getMensajes } = require("../config");

exports.get = async (req, res) => {
  try {
    const mensajesInformacion = await MensajesInformacion.find()
      .sort({ pagina: 1 })
      .exec();
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

exports.updateMany = async (req, res) => {
  try {
    const mensajesInformacion = req.body;

    for (let mensaje of mensajesInformacion) {
      const { _id, pagina, ...datosAActualizar } = mensaje;

      const filter = { pagina };

      await MensajesInformacion.updateOne(filter, datosAActualizar).exec();
    }

    res.status(200).send({ respuesta: await getMensajes("success") });
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
