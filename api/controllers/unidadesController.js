const Unidades = require("../models/Unidades");
const { getMensajes } = require("../config");

exports.get = async (req, res) => {
  try {
    const { tipo, incluirDeshabilitados } = req.query;

    let filter = { version: 1 };

    if (tipo) filter.tipo = tipo;
    if (incluirDeshabilitados !== "true") filter.habilitado = true;

    const unidades = await Unidades.find(filter).sort({ posicion: 1 }).exec();
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

exports.create = async (req, res) => {
  try {
    const { _id, ...unidad } = req.body;

    unidad.version = 1;

    await Unidades.create(unidad);

    res.status(201).send({ respuesta: await getMensajes("created") });
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

exports.update = async (req, res) => {
  try {
    const { _id } = req.params;

    const unidad = req.body;

    delete unidad._id;
    delete unidad.__v;
    delete unidad.version;

    await Unidades.updateOne({ _id }, unidad).exec();

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

exports.delete = async (req, res) => {
  try {
    const { _id } = req.params;

    await Unidades.deleteOne({ _id }).exec();

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
