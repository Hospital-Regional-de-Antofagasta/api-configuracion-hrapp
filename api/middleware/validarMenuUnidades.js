const { getMensajes } = require("../config");
const MenuUnidades = require("../models/MenuUnidades");

exports.requiredData = async (req, res, next) => {
  try {
    const {
      icono,
      title,
      subtitle,
      tipo,
      habilitado,
      implementado,
      mensajeImplementado,
      posicion,
    } = req.body;

    if (!icono)
      return res
        .status(400)
        .send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar el icono.",
        });

    if (!title)
      return res
        .status(400)
        .send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar el título.",
        });

    if (!subtitle)
      return res
        .status(400)
        .send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar el subtítulo.",
        });

    if (!tipo)
      return res
        .status(400)
        .send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar el tipo.",
        });

    if (habilitado === null || habilitado === "")
      return res
        .status(400)
        .send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar si esta habilitado o no.",
        });

    if (!posicion)
      return res
        .status(400)
        .send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar la posición.",
        });

    next();
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

exports.invalidaData = async (req, res, next) => {
  try {
    const {
      icono,
      title,
      subtitle,
      tipo,
      habilitado,
      implementado,
      mensajeImplementado,
      posicion,
    } = req.body;

    const regexString = new RegExp(/^[\s\w\.\,\-áéíóúÁÉÍÓÚñÑ%$¡!¿?(){}[\]:;'"+*/<>]+$/);
    const regexNumber = new RegExp(/^\d$/);
    const regexBoolean = new RegExp(/^true|false$/);

    if (icono !== undefined) {
      if (!regexString.test(icono))
        return res
          .status(400)
          .send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "El icono no tiene el formato correcto.",
          });
    }

    if (title !== undefined) {
      if (!regexString.test(title))
        return res
          .status(400)
          .send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "El título no tiene el formato correcto.",
          });
    }

    if (subtitle !== undefined) {
      if (!regexString.test(subtitle))
        return res
          .status(400)
          .send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "El subtítulo no tiene el formato correcto.",
          });
    }

    if (tipo !== undefined) {
      if (!regexString.test(tipo))
        return res
          .status(400)
          .send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "El tipo no tiene el formato correcto.",
          });
    }

    if (habilitado !== undefined) {
      if (!regexBoolean.test(habilitado))
        return res
          .status(400)
          .send({
            respuesta: await getMensajes("badRequest"),
            detalles_error:
              "Si esta habilitado o no no tiene el formato correcto.",
          });
    }

    if (posicion !== undefined) {
      if (!regexNumber.test(posicion))
        return res
          .status(400)
          .send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "La posición no tiene el formato correcto.",
          });

      if (posicion <= 0)
        return res
          .status(400)
          .send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "La posición debe ser mayor a 0.",
          });
    }

    next();
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

exports.itemExists = async (req, res, next) => {
  try {
    const { _id } = req.params;

    if (!_id)
      return res
        .status(400)
        .send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar el _id.",
        });

    const item = await MenuUnidades.findOne({ _id }).exec();

    if (!item)
      return res
        .status(404)
        .send({
          respuesta: await getMensajes("notFound"),
          detalles_error: "No se encontró el elemento.",
        });

    next();
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
