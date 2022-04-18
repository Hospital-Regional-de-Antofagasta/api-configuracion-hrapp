const { getMensajes } = require("../config");
const MenuUnidades = require("../models/MenuUnidades");
const { manejarError } = require("../utils/errorController");

exports.validateCreate = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!(await uniqueTitle(title, null)))
      return res.status(400).send({
        respuesta: await getMensajes("badRequest"),
        detalles_error: "El nombre no puede ser duplicado.",
      });

    next();
  } catch (error) {
    await manejarError(error, req, res);
  }
};

exports.validateUpdate = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { title } = req.body;

    if (!(await uniqueTitle(title, _id)))
      return res.status(400).send({
        respuesta: await getMensajes("badRequest"),
        detalles_error: "El nombre no puede ser duplicado.",
      });

    next();
  } catch (error) {
    await manejarError(error, req, res);
  }
};

exports.itemExists = async (req, res, next) => {
  try {
    const { _id } = req.params;

    if (!_id)
      return res.status(400).send({
        respuesta: await getMensajes("badRequest"),
        detalles_error: "Se debe ingresar el _id.",
      });

    const item = await MenuUnidades.findOne({ _id }).exec();

    if (!item)
      return res.status(404).send({
        respuesta: await getMensajes("notFound"),
        detalles_error: "No se encontró el elemento.",
      });

    next();
  } catch (error) {
    await manejarError(error, req, res);
  }
};

const uniqueTitle = async (title, _id) => {
  if (title) {
    const menuUnidadConMismoTitulo = _id
      ? await MenuUnidades.findOne({ title, _id: { $ne: _id } }).exec()
      : await MenuUnidades.findOne({ title }).exec();
    return menuUnidadConMismoTitulo ? false : true;
  }
};
