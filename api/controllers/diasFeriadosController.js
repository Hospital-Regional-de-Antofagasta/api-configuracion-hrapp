const DiasFeriados = require("../models/DiasFeriados");
const { getMensajes } = require("../config");

exports.get = async (req, res) => {
  try {
    const diasFeriados = await DiasFeriados.find()
      .select("fecha -_id") //quitar el _id
      .exec();
    res.status(200).send(diasFeriados);
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
