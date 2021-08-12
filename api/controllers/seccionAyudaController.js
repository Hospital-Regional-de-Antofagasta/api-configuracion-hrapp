const SeccionAyuda = require("../models/SeccionAyuda");
const { getMensajes } = require("../config");

exports.get = async (req, res) => {
  try {
    const tipo = req.query.tipo;
    const filter = tipo ? {
      tipo,
      habilitado: true,
      version: 1,
    } : {
      habilitado: true,
      version: 1,
    };
    const seccionAyuda = await SeccionAyuda.find(filter)
      .sort({ posicion: 1 })
      .exec();

    for (const slide of seccionAyuda) {
      await slide.preguntas.sort((a, b) => {
        return a.slide - b.slide;
      });
    }

    res.status(200).send(seccionAyuda);
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
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
