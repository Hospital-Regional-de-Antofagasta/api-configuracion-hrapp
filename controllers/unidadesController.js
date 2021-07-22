const Unidades = require("../models/Unidades");
const { getMensajes } = require("../api/config");

exports.get = async (req, res) => {
  try {
    const tipo = req.query.tipo;
    const filter = tipo ? { version: 1, tipo } : { version: 1 };
    const unidades = await Unidades.find(filter)
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(unidades);
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
