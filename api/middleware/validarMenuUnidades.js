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
        .send({ respuesta: await getMensajes("badRequest") });

    if (!title)
      return res
        .status(400)
        .send({ respuesta: await getMensajes("badRequest") });

    if (!subtitle)
      return res
        .status(400)
        .send({ respuesta: await getMensajes("badRequest") });

    if (!tipo)
      return res
        .status(400)
        .send({ respuesta: await getMensajes("badRequest") });

    if (habilitado === null || habilitado === "")
      return res
        .status(400)
        .send({ respuesta: await getMensajes("badRequest") });

    if (implementado === null || implementado === "")
      return res
        .status(400)
        .send({ respuesta: await getMensajes("badRequest") });

    if (!mensajeImplementado)
      return res
        .status(400)
        .send({ respuesta: await getMensajes("badRequest") });

    if (!posicion)
      return res
        .status(400)
        .send({ respuesta: await getMensajes("badRequest") });

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

    const regexString = new RegExp(/^[\s\w\.\,\-áéíóúÁÉÍÓÚñÑ%$¡!¿?()]+$/);
    const regexNumber = new RegExp(/^\d$/);
    const regexBoolean = new RegExp(/^true|false$/);

    if (icono !== undefined) {
      if (!regexString.test(icono))
        return res
          .status(400)
          .send({ respuesta: await getMensajes("badRequest") });
    }

    if (title !== undefined) {
      if (!regexString.test(title))
        return res
          .status(400)
          .send({ respuesta: await getMensajes("badRequest") });
    }

    if (subtitle !== undefined) {
      if (!regexString.test(subtitle))
        return res
          .status(400)
          .send({ respuesta: await getMensajes("badRequest") });
    }

    if (tipo !== undefined) {
      if (!regexString.test(tipo))
        return res
          .status(400)
          .send({ respuesta: await getMensajes("badRequest") });
    }

    if (habilitado !== undefined) {
      if (!regexBoolean.test(habilitado))
        return res
          .status(400)
          .send({ respuesta: await getMensajes("badRequest") });
    }

    if (implementado !== undefined) {
      if (!regexBoolean.test(implementado))
        return res
          .status(400)
          .send({ respuesta: await getMensajes("badRequest") });
    }

    if (mensajeImplementado !== undefined) {
      if (!regexString.test(mensajeImplementado))
        return res
          .status(400)
          .send({ respuesta: await getMensajes("badRequest") });
    }

    if (posicion !== undefined) {
      if (!regexNumber.test(posicion))
        return res
          .status(400)
          .send({ respuesta: await getMensajes("badRequest") });

      if (posicion <= 0)
        return res
          .status(400)
          .send({ respuesta: await getMensajes("badRequest") });
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
        .send({ respuesta: await getMensajes("badRequest") });

    const item = await MenuUnidades.findOne({ _id }).exec();

    if (!item)
      return res
        .status(404)
        .send({ respuesta: await getMensajes("notFound") });

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
