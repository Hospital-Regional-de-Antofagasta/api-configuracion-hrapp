const Regiones = require("../../models/Regiones");
// const Provincias = require("../models/Provincias");
const Ciudades = require("../../models/Ciudades");
// const Comunas = require("../models/Comunas");
const { getMensajes } = require("../config");

exports.get = async (req, res) => {
  try {
    const ubicaciones = await Promise.all([
      Regiones.find().exec(),
      Ciudades.find().exec(),
    ]);
    res.status(200).send(ubicaciones);
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
