const MenuServiciosPaciente = require("../models/MenuServiciosPaciente");
const MenuInicio = require("../models/MenuInicio");
const MenuDocumentos = require("../models/MenuDocumentos");
const MenuInformacionGeneral = require("../models/MenuInformacionGeneral");
const MenuUnidades = require("../models/MenuUnidades");
const { getMensajes } = require("../api/config");

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
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};

exports.getUnidades = async (req, res) => {
  try {
    const menuUnidades = await MenuUnidades.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(menuUnidades);
  } catch (error) {
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
    const menusCargaInicio = {
      menuServiciosPaciente,
      menuInicio,
      // menuDocumentos,
      menuInformacionGeneral,
      menuUnidades,
    };
    res.status(200).send(menusCargaInicio);
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
