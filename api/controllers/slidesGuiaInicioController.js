const SlidesGuiaInicio = require("../models/SlidesGuiaInicio");
const { getMensajes } = require("../config");

exports.get = async (req, res) => {
  try {
    const filter = {
      habilitado: true,
      version: 1,
    };
    const slidesGuiaInicio = await SlidesGuiaInicio.find(filter)
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(slidesGuiaInicio);
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
