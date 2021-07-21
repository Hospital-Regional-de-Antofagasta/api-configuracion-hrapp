const MisionVision = require("../models/MisionVision");
const { getMensajes } = require("../api/config");

exports.get = async (req, res) => {
  try {
    const misionVision = await MisionVision.findOne({
      version: 1,
    })
      .sort({ posicion: 1 })
      .exec();
    res.status(200).send(misionVision);
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
