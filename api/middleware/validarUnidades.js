const { getMensajes } = require("../config");
const Unidades = require("../models/Unidades");

exports.requiredData = async (req, res, next) => {
  try {
    const {
      nombre,
      descripcion,
      servicios,
      atenciones,
      referencias,
      tipo,
      habilitado,
      posicion,
    } = req.body;

    if (!nombre)
      return res.status(400).send({
        respuesta: await getMensajes("badRequest"),
        detalles_error: "Se debe ingresar el nombre.",
      });

    for (let servicio of servicios) {
      if (!servicio)
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar el servicio.",
        });
    }

    for (let atencion of atenciones) {
      const { nombre, horario, contactos } = atencion;

      if (!nombre)
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar el nombre de la atención.",
        });

      const { nota, atiendeFeriados, periodos } = horario;

      if (atiendeFeriados === null || atiendeFeriados === "")
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar si atiende feriados.",
        });

      if (!periodos)
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Se debe ingresar al menos un periodo.",
        });

      for (let periodo of periodos) {
        const { dias, horas } = periodo;
        const { inicio, fin } = dias;

        if (!inicio)
          return res.status(400).send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "Se debe ingresar el día de inicio.",
          });

        if (!fin)
          return res.status(400).send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "Se debe ingresar el día de término.",
          });

        if (!horas)
          return res.status(400).send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "Se debe ingresar al menos un horario.",
          });

        for (let hora of horas) {
          const { inicio, fin } = hora;

          if (!inicio)
            return res.status(400).send({
              respuesta: await getMensajes("badRequest"),
              detalles_error: "Se debe ingresar la hora de inicio.",
            });

          if (!fin)
            return res.status(400).send({
              respuesta: await getMensajes("badRequest"),
              detalles_error: "Se debe ingresar la hora de término.",
            });
        }
      }

      if (contactos) {
        const { telefonos, correos } = contactos;

        for (let telefono of telefonos) {
          if (!telefono)
            return res.status(400).send({
              respuesta: await getMensajes("badRequest"),
              detalles_error: "Se debe ingresar el teléfono.",
            });
        }

        for (let correo of correos) {
          if (!correo)
            return res.status(400).send({
              respuesta: await getMensajes("badRequest"),
              detalles_error: "Se debe ingresar el correo electrónico.",
            });
        }
      }
    }

    for (let referencia of referencias) {
      const { ubicacion, imagen } = referencia;

      if (!imagen) {
        const { src, alt, srcset } = imagen;

        if (!alt)
          return res.status(400).send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "Se debe ingresar la descripción de la imagen.",
          });

        for (let url of srcset) {
          if (!url)
            return res.status(400).send({
              respuesta: await getMensajes("badRequest"),
              detalles_error: "Se debe ingresar la url de la imagen.",
            });
        }
      }
    }

    if (!tipo)
      return res.status(400).send({
        respuesta: await getMensajes("badRequest"),
        detalles_error: "Se debe ingresar el tipo.",
      });

    if (!posicion)
      return res.status(400).send({
        respuesta: await getMensajes("badRequest"),
        detalles_error: "Se debe ingresar la posición.",
      });

    if (!habilitado)
      return res.status(400).send({
        respuesta: await getMensajes("badRequest"),
        detalles_error: "Se debe ingresar si esta habilitado o no.",
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

exports.invalidData = async (req, res, next) => {
  try {
    const {
      nombre,
      descripcion,
      servicios,
      atenciones,
      referencias,
      tipo,
      habilitado,
      posicion,
    } = req.body;

    const regexString = new RegExp(
      /^[\s\w\.\,\-áéíóúÁÉÍÓÚñÑ%$¡!¿?(){}[\]:;'"+*@]*$/
    );
    const regexCorreo = new RegExp(
      /^[a-zA-Z0-9_\-\.]+@([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/
    );
    const regexNumber = new RegExp(/^\d*$/);
    const regexBoolean = new RegExp(/^true|false$/);
    const regexSrcUrl = new RegExp(
      /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
    );
    const regexSrcsetUrl = new RegExp(
      /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*) \d+w$/
    );
    const regexTipo = new RegExp(/^[a-zA-Z]{1,50}$/);

    if (nombre !== undefined)
      if (!regexString.test(nombre))
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "El nombre no tiene el formato correcto.",
        });

    if (descripcion !== undefined)
      if (!regexString.test(descripcion))
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "La descripción no tiene el formato correcto.",
        });

    for (let servicio of servicios) {
      if (!regexString.test(servicio))
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "El servicio no tiene el formato correcto.",
        });
    }

    for (let atencion of atenciones) {
      const { nombre, horario, contactos } = atencion;

      if (!regexString.test(nombre))
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error:
            "El nombre de la atención no tiene el formato correcto.",
        });

      const { nota, atiendeFeriados, periodos } = horario;

      if (!regexString.test(nota))
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "La nota no tiene el formato correcto.",
        });

      if (!regexBoolean.test(atiendeFeriados))
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "Si atiende feriados no tiene el formato correcto.",
        });

      for (let periodo of periodos) {
        const { dias, horas } = periodo;
        const { inicio, fin } = dias;

        if (!regexString.test(inicio))
          return res.status(400).send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "El día de inicio no tiene el formato correcto.",
          });

        if (!regexString.test(fin))
          return res.status(400).send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "El día de término no tiene el formato correcto.",
          });

        for (let hora of horas) {
          const { inicio, fin } = hora;

          if (!regexString.test(inicio))
            return res.status(400).send({
              respuesta: await getMensajes("badRequest"),
              detalles_error: "La hora de inicio no tiene el formato correcto.",
            });

          if (!regexString.test(fin))
            return res.status(400).send({
              respuesta: await getMensajes("badRequest"),
              detalles_error:
                "La hora de término no tiene el formato correcto.",
            });
        }
      }

      if (contactos) {
        const { telefonos, correos } = contactos;

        for (let telefono of telefonos) {
          if (!regexString.test(telefono))
            return res.status(400).send({
              respuesta: await getMensajes("badRequest"),
              detalles_error: "El teléfono no tiene el formato correcto.",
            });
        }

        for (let correo of correos) {
          if (!regexCorreo.test(correo))
            return res.status(400).send({
              respuesta: await getMensajes("badRequest"),
              detalles_error:
                "El correo electrónico no tiene el formato correcto.",
            });
        }
      }
    }

    for (let referencia of referencias) {
      const { ubicacion, imagen } = referencia;

      if (!regexString.test(ubicacion))
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "la ubicación no tiene el formato correcto.",
        });

      const { src, alt, srcset } = imagen;

      if (src)
        if (!regexSrcUrl.test(src))
          return res.status(400).send({
            respuesta: await getMensajes("badRequest"),
            detalles_error:
              "La url por defecto de la imagen no tiene el formato correcto.",
          });

      if (!regexString.test(alt))
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error:
            "La descripción de la imagen no tiene el formato correcto.",
        });

      for (let url of srcset) {
        if (!regexSrcsetUrl.test(url))
          return res.status(400).send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: "La url de la imagen no tiene el formato correcto.",
          });
      }
    }

    if (tipo !== undefined)
      if (!regexTipo.test(tipo))
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "El tipo no tiene el formato correcto.",
        });

    if (!posicion) {
      if (!regexNumber.test(posicion))
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "La posición no tiene el formato correcto.",
        });

      if (posicion <= 0)
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error: "La posición debe ser mayor a 0.",
        });
    }

    if (habilitado !== undefined)
      if (!regexBoolean.test(habilitado))
        return res.status(400).send({
          respuesta: await getMensajes("badRequest"),
          detalles_error:
            "Si esta habilitado o no no tiene el formato correcto.",
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

exports.elementExists = async (req, res, next) => {
  try {
    const { _id } = req.params;

    if (!_id)
      return res.status(400).send({
        respuesta: await getMensajes("badRequest"),
        detalles_error: "Se debe ingresar el _id.",
      });

    const unidad = await Unidades.findOne({ _id }).exec();

    if (!unidad)
      return res.status(404).send({
        respuesta: await getMensajes("notFound"),
        detalles_error: "No se encontró la unidad.",
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

exports.invalidImages = async (req, res, next) => {
  try {
    const {
      nombre,
      descripcion,
      servicios,
      atenciones,
      referencias,
      tipo,
      habilitado,
      posicion,
    } = req.body;

    const regexResolucion = new RegExp(/^[0-9]{3,4}x[0-9]{3,4}$/);

    for (let referencia of referencias) {
      const { ubicacion, imagen } = referencia;

      const { imagenesEnviar } = imagen;

      if (imagenesEnviar)
        for (let imagenEnviar of imagenesEnviar) {
          const { imagen, resolucion } = imagenEnviar;

          const allowedMimeTypes = ["image/png", "image/jpeg"];

          const mimeType = imagen.match(
            /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
          )[1];

          if (!allowedMimeTypes.includes(mimeType))
            return res.status(400).send({
              respuesta: await getMensajes("badRequest"),
              detalles_error: "La imagen debe ser image/png o image/jpeg",
            });

          if (!regexResolucion.test(resolucion))
            return res.status(400).send({
              respuesta: await getMensajes("badRequest"),
              detalles_error:
                "La resolucion de la imagen no tiene el formato correcto.",
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
