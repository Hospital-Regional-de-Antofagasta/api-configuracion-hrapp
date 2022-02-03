const MensajesInformacion = require("../models/MensajesInformacion");
const { getMensajes } = require("../config");
const { manejarError } = require("../utils/errorController");
const { registerAuditLog } = require("../utils/auditLogController");

exports.get = async (req, res) => {
  try {
    const mensajesInformacion = await MensajesInformacion.find()
      .sort({ pagina: 1 })
      .exec();
    res.status(200).send(mensajesInformacion);
  } catch (error) {
    await manejarError(error, req, res)
  }
};

exports.updateMany = async (req, res) => {
  try {
    const mensajesInformacion = req.body;

    const idsMensajesInformacion = [];

    for (let mensaje of mensajesInformacion) {
      const { _id, pagina, ...datosAActualizar } = mensaje;

      idsMensajesInformacion.push(_id)

      const filter = { pagina };

      await MensajesInformacion.updateOne(filter, datosAActualizar).exec();
    }

    await registerAuditLog(
      req.user.userName,
      req.user._id,
      "PUT /v1/configuracion-hrapp/mensajes-informacion",
      { _ids: idsMensajesInformacion }
    );

    res.status(200).send({ respuesta: await getMensajes("success") });
  } catch (error) {
    await manejarError(error, req, res)
  }
};
