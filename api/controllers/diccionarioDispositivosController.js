const DiccionarioDispositivos = require("../models/DiccionarioDispositivos");
const { getMensajes } = require("../config");
const { handleError } = require("../utils/errorHandler");

exports.get = async (req, res) => {
  try {
    const { idDispositivo } = req.params;
    const dispositivo = await DiccionarioDispositivos.findOne({
      id: idDispositivo,
    }).exec();
    if (!dispositivo?.name) return res.status(200).send({nombre: idDispositivo});
    res.status(200).send({nombre: dispositivo.name});
  } catch (error) {
    await handleError(res, error);
  }
};
