const DiccionarioSiglas = require("../models/DiccionarioSiglas");
const { getMensajes } = require("../config");

exports.get = async (req, res) => {
  try {
    const diccionarioSiglas = await DiccionarioSiglas.find().exec();
    res.status(200).send(diccionarioSiglas);
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
