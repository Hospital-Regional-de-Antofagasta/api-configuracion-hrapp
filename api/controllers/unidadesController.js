const Unidades = require("../models/Unidades");
const { getMensajes } = require("../config");
const { uploadImage, deleteFolder } = require("../utils/imagesManager");
const { v4: uuidv4 } = require("uuid");

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

    unidad.referencias = await subirImagenesReferencias(unidad.referencias, []);

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
    const idUnidad = req.params._id;
    const { _id, __v, version, ...unidad } = req.body;

    const unidadAntigua = await Unidades.findOne({ _id: idUnidad }).exec();

    unidad.referencias = await subirImagenesReferencias(
      unidad.referencias,
      unidadAntigua.referencias
    );
    await Unidades.updateOne({ _id: idUnidad }, unidad).exec();

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

    const unidad = await Unidades.findOne({ _id }).exec();
    await eliminarImagenesReferencias(unidad.referencias);

    await Unidades.deleteOne({ _id }).exec();

    res.status(200).send({ respuesta: await getMensajes("success") });
  } catch (error) {
    console.log({
      nombre: error.name,
      mensaje: error.message,
    })
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

const subirImagenesReferencias = async (referencias, referenciasAntiguas) => {
  const newReferencias = [];
  for (let referencia of referencias) {
    let carpeta = uuidv4();
    // identificar si corresponde a una referencia existente
    let referenciaAntiguaAActualizar;
    if (referenciasAntiguas)
      for (let referenciaAntigua of referenciasAntiguas) {
        if (referenciaAntigua._id.equals(referencia._id)) {
          carpeta = referenciaAntigua.imagen.carpeta;
          referenciaAntiguaAActualizar = referenciaAntigua;
          break;
        }
      }
    // verificar si se subio una nueva imagen para esta referencia
    if (!referencia.imagen.imagenesEnviar) {
      if (referenciaAntiguaAActualizar) newReferencias.push(referenciaAntiguaAActualizar);
      continue;
    }
    // si corresponde a una referencia existente eliminar sus imagenes
    if (referenciaAntiguaAActualizar) await deleteFolder(`prestaciones/${carpeta}`);
    // subir las nuevas imagenes
    for (let imagenEnviar of referencia.imagen.imagenesEnviar) {
      const { imagen, resolucion } = imagenEnviar;
      imagenEnviar.url = await uploadImage(
        imagen,
        resolucion,
        `prestaciones/${carpeta}/`
      );
      // calcular la cantidad de pixeles para ordenar las imagenes por resolucion
      const valoresResolucion = resolucion.split("x");
      imagenEnviar.cantPixeles = valoresResolucion[0] * valoresResolucion[1];
    }
    // ordenar imagenes por resolucion
    const imagenesEnviarOrdenadas = referencia.imagen.imagenesEnviar.sort(
      (a, b) => {
        return b.cantPixeles - a.cantPixeles;
      }
    );
    // agregar a que tamanio de pantalla corresponde cada resolucion
    const screenSizes = ["2160w", "1080w", "720w", "480w"];
    const newSrcset = [];
    let newSrc = "";
    for (let i = 0; i < screenSizes.length; i++) {
      if (imagenesEnviarOrdenadas[i])
        newSrcset.push(`${imagenesEnviarOrdenadas[i].url} ${screenSizes[i]}`);
      if (i === imagenesEnviarOrdenadas.length - 1) {
        newSrc = imagenesEnviarOrdenadas[i].url;
        break;
      }
      if (i === screenSizes.length - 1) newSrc = imagenesEnviarOrdenadas[i].url;
    }
    // generar la nueva referencia
    newReferencias.push({
      ubicacion: referencia.ubicacion,
      imagen: {
        src: newSrc,
        alt: referencia.imagen.alt,
        srcset: newSrcset,
        carpeta,
      },
    });
  }

  return newReferencias;
};

const eliminarImagenesReferencias = async (referencias) => {
  for (let referencia of referencias) {
    await deleteFolder(`prestaciones/${referencia.imagen.carpeta}`);
  }
};
