const MenuServiciosPaciente = require("../models/MenuServiciosPaciente");
const MenuInicio = require("../models/MenuInicio");
const MenuDocumentos = require("../models/MenuDocumentos");
const MenuInformacionGeneral = require("../models/MenuInformacionGeneral");
const MenuUnidades = require("../models/MenuUnidades");
const MenuTabs = require("../models/MenuTabs");
const { getMensajes } = require("../config");

exports.getServiciospaciente = async (req, res) => {
  try {
    const menuServiciosPaciente = await MenuServiciosPaciente.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(menuServiciosPaciente);
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

exports.getInicio = async (req, res) => {
  try {
    const menuInicio = await MenuInicio.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(menuInicio);
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

exports.getDocumentos = async (req, res) => {
  try {
    const menuDocumentos = await MenuDocumentos.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(menuDocumentos);
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

exports.getInformacionGeneral = async (req, res) => {
  try {
    const menuInformacionGeneral = await MenuInformacionGeneral.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(menuInformacionGeneral);
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

exports.getItemsUnidades = async (req, res) => {
  try {
    const { incluirDeshabilitados } = req.query;

    let filter = { version: 1 };

    if (incluirDeshabilitados !== "true") filter.habilitado = true;

    const menuUnidades = await MenuUnidades.find(filter)
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(menuUnidades);
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

exports.createItemUnidad = async (req, res) => {
  try {
    const item = req.body;

    item.implementado = true;
    item.mensajeImplementado = "En construcción";
    item.version = 1;

    await MenuUnidades.create(item);

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

exports.updateItemUnidad = async (req, res) => {
  try {
    const { _id } = req.params;

    const item = req.body;

    delete item._id;
    delete item.__v;
    delete item.version;

    await MenuUnidades.updateOne({ _id }, item).exec();

    res.status(200).send({ respuesta: await getMensajes("success")});
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

exports.deleteItemUnidad = async (req, res) => {
  try {
    const { _id } = req.params;

    await MenuUnidades.deleteOne({ _id }).exec();

    res.status(200).send({ respuesta: await getMensajes("success")});
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

exports.getTabs = async (req, res) => {
  try {
    const menuTabs = await MenuTabs.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(menuTabs);
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

exports.getMenusCargaInicio = async (req, res) => {
  try {
    const menuServiciosPaciente = await MenuServiciosPaciente.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    const menuInicio = await MenuInicio.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    // const menuDocumentos = await MenuDocumentos.find({
    //   habilitado: true,
    //   version: 1,
    // })
    //   .sort({ posicion: 1 })
    //   .exec();
    const menuInformacionGeneral = await MenuInformacionGeneral.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    const menuUnidades = await MenuUnidades.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    const menuTabs = await MenuTabs.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    const menusCargaInicio = {
      menuServiciosPaciente,
      menuInicio,
      // menuDocumentos,
      menuInformacionGeneral,
      menuUnidades,
      menuTabs,
    };
    res.status(200).send(menusCargaInicio);
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
