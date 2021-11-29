const { getMensajes } = require("../config");
const MensajesInformacion = require("../models/MensajesInformacion");

exports.requiredData = async (req, res, next) => {
  try {
    const mensajesInformacion = req.body;

    for (let mensaje of mensajesInformacion) {
      const { pagina, texto, color } = mensaje;

      if (!pagina)
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar la página.",
        });

      if (!color)
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar el color.",
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

exports.invalidData = async (req, res, next) => {
  try {
    const mensajesInformacion = req.body;

    const regexString = new RegExp(
      /^[\s\w\.\,\-áéíóúÁÉÍÓÚñÑ%$¡!¿?(){}[\]:;'"+*/<>@]*$/
    );
    const regexPagina = new RegExp(/^[a-zA-Z]{1,50}$/);
    const regexColor = new RegExp(/^info|warning|danger$/);

    for (let mensaje of mensajesInformacion) {
      const { pagina, texto, color } = mensaje;

      if (pagina !== undefined) {
        if (!regexPagina.test(pagina))
          return res.status(400).send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "Se debe ingresar la página.",
          });
      }

      if (texto !== undefined) {
        if (!regexString.test(texto))
          return res.status(400).send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "Se debe ingresar el texto del mensaje.",
          });
      }

      if (color !== undefined) {
        if (!regexColor.test(color))
          return res.status(400).send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "Se debe ingresar el color.",
          });
      }
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

exports.elementExists = async (req, res, next) => {
  try {
    const mensajesInformacion = req.body;

    if (!mensajesInformacion)
      return res.status(400).send({
        respuesta: await getMensajes("badRequest"),
        detalles_error: "Se debe ingresar al menos un mensaje.",
      });

    for (let mensaje of mensajesInformacion) {
      const { pagina, texto, color } = mensaje;

      const mensajeEncontrado = await MensajesInformacion.findOne({ pagina }).exec();

      if (!mensajeEncontrado)
        return res.status(404).send({
          respuesta: await getMensajes("notFound"),
          detalles_error: "No se encontró la página del mensaje.",
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
