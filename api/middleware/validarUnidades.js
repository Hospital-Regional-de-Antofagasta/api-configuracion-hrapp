const { getMensajes } = require("../config");
const Unidades = require("../models/Unidades");
const { manejarError } = require("../utils/errorController");

exports.unidadExists = async (req, res, next) => {
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
    await manejarError(error, req, res);
  }
};

exports.requireNewImages = async (req, res, next) => {
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

    if (!referencias)
      return res.status(400).send({
        respuesta: await getMensajes("badRequest"),
        detalles_error: {
          imagenesEnviar: {
            imagenesEnviar: "Se debe ingresar al menos una referencia.",
          },
        },
      });

    for (let referencia of referencias) {
      const { ubicacion, imagen } = referencia;

      if (imagen) {
        const { imagenesEnviar } = imagen;
        if (!imagenesEnviar)
          return res.status(400).send({
            respuesta: await getMensajes("badRequest"),
            detalles_error: {
              imagenesEnviar: "Se debe enviar las imagenes.",
            },
          });
      }
    }

    next();
  } catch (error) {
    await manejarError(error, req, res);
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

    const regexResolucion = new RegExp(/^(800x400|1600x800|2400x1200)$/);

    if (!referencias)
      return res.status(400).send({
        respuesta: await getMensajes("badRequest"),
        detalles_error: {
          imagenesEnviar: "Se debe ingresar al menos una referencia.",
        },
      });

    for (let referencia of referencias) {
      const { ubicacion, imagen } = referencia;

      if (imagen) {
        const { imagenesEnviar } = imagen;

        if (imagenesEnviar) {
          if (imagenesEnviar.length !== 3)
            return res.status(400).send({
              respuesta: await getMensajes("badRequest"),
              detalles_error: {
                imagenesEnviar: "Se deben ingresar las 3 imagenes.",
              },
            });

          for (let imagenEnviar of imagenesEnviar) {
            const { imagen, resolucion } = imagenEnviar;

            if (!imagen)
              return res.status(400).send({
                respuesta: await getMensajes("badRequest"),
                detalles_error: {
                  imagenesEnviar: "La imagen no debe ser vacía.",
                },
              });

            const allowedMimeTypes = ["image/png", "image/jpeg"];

            const mimeType = imagen.match(
              /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
            )[1];

            if (!allowedMimeTypes.includes(mimeType))
              return res.status(400).send({
                respuesta: await getMensajes("badRequest"),
                detalles_error: {
                  imagenesEnviar: "La imagen debe ser image/png o image/jpeg.",
                },
              });

            if (!regexResolucion.test(resolucion))
              return res.status(400).send({
                respuesta: await getMensajes("badRequest"),
                detalles_error: {
                  imagenesEnviar:
                    "La resolucion de la imagen no tiene el formato correcto.",
                },
              });
          }
        }
      }
    }

    next();
  } catch (error) {
    await manejarError(error, req, res);
  }
};
