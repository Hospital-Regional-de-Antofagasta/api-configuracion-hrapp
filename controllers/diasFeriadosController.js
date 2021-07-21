const DiasFeriados = require("../models/DiasFeriados");
const { getMensajes } = require("../api/config");

exports.get = async (req, res) => {
  try {
    const diasFeriados = await DiasFeriados.find()
      .select("fecha -_id") //quitar el _id
      .exec();
    res.status(200).send(diasFeriados);
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
