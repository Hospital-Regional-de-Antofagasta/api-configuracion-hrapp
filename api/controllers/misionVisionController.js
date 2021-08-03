const MisionVision = require("../models/MisionVision");
const { getMensajes } = require("../config");

exports.get = async (req, res) => {
  try {
    const misionVision = await MisionVision.findOne({
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(misionVision);
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
