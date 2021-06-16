const DiasFeriados = require("../../models/DiasFeriados");
const { mensajes } = require("../config");

exports.get = async (req, res) => {
  try {
    const diasFeriados = await DiasFeriados.find()
      .select("fecha -_id") //quitar el _id
      .exec();
    res.status(200).send(diasFeriados);
  } catch (error) {
    res.status(500).send({ respuesta: mensajes.serverError });
  }
};
