const MenuServiciosPaciente = require("../models/MenuServiciosPaciente");
const MenuInicio = require("../models/MenuInicio");
const MenuDocumentos = require("../models/MenuDocumentos");
const MenuInformacioGEneral = require("../models/MenuInformacionGeneral");
const { getMensajes } = require("../api/config");

exports.getServiciospaciente = async (req, res) => {
  try {
    const menuServiciosPaciente = await MenuServiciosPaciente.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    // const menuServiciosPacienteEnviar = menuServiciosPaciente
    //   .filter((servicioPaciente) => servicioPaciente.habilitado)
    //   .sort((primero, segundo) => primero.posicion - segundo.posicion);
    // res.status(200).send(menuServiciosPacienteEnviar);
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
    const menuInformacioGEneral = await MenuInformacioGEneral.find({
      habilitado: true,
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(menuInformacioGEneral);
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
