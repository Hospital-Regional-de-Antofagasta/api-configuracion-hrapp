const Unidades = require("../models/Unidades");
const { getMensajes } = require("../config");

exports.get = async (req, res) => {
  try {
    const tipo = req.query.tipo;
    const filter = tipo ? { version: 1, tipo } : { version: 1 };
    const unidades = await Unidades.find(filter)
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(unidades);
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
