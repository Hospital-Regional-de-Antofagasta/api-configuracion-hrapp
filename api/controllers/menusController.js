const MenuServiciosPaciente = require("../models/MenuServiciosPaciente");
const MenuInicio = require("../models/MenuInicio");
const MenuDocumentos = require("../models/MenuDocumentos");
const MenuInformacionGeneral = require("../models/MenuInformacionGeneral");
const MenuUnidades = require("../models/MenuUnidades");
const MenuTabs = require("../models/MenuTabs");
const { getMensajes } = require("../config");
const { manejarError } = require("../utils/errorController");
const { registerAuditLog } = require("../utils/auditLogController");

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
    await manejarError(error, req, res);
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
    await manejarError(error, req, res)
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
    await manejarError(error, req, res)
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
    await manejarError(error, req, res)
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
    await manejarError(error, req, res)
  }
};

exports.createItemUnidad = async (req, res) => {
  try {
    const { _id, ...item } = req.body;

    item.implementado = true;
    item.mensajeImplementado = "En construcción";
    item.version = 1;

    if (item.title)
      item.redirecTo = `tabs/tab3/menu-prestaciones/unidades?tipo=${item.tipo}&titulo=${item.title.replace(" ", "+")}`;

    const newItemMenuUnidad = await MenuUnidades.create(item);

    await registerAuditLog(
      req.user.userName,
      req.user._id,
      "POST /v1/configuracion-hrapp/menu/unidades",
      { _id: newItemMenuUnidad._id }
    );

    res.status(201).send({ respuesta: await getMensajes("created") });
  } catch (error) {
    await manejarError(error, req, res)
  }
};

exports.updateItemUnidad = async (req, res) => {
  try {
    const { _id } = req.params;

    const item = req.body;

    delete item._id;
    delete item.__v;
    delete item.version;

    item.redirecTo = `tabs/tab3/menu-prestaciones/unidades?tipo=${item.tipo}&titulo=${item.title.replace(" ", "+")}`;

    await MenuUnidades.updateOne({ _id }, item, { runValidators: true }).exec();

    await registerAuditLog(
      req.user.userName,
      req.user._id,
      "PUT /v1/configuracion-hrapp/menu/unidades/:_id",
      { _id }
    );

    res.status(200).send({ respuesta: await getMensajes("success") });
  } catch (error) {
    await manejarError(error, req, res)
  }
};

exports.deleteItemUnidad = async (req, res) => {
  try {
    const { _id } = req.params;

    await MenuUnidades.deleteOne({ _id }).exec();

    await registerAuditLog(
      req.user.userName,
      req.user._id,
      "DELETE /v1/configuracion-hrapp/menu/unidades/:_id",
      { _id }
    );

    res.status(200).send({ respuesta: await getMensajes("success") });
  } catch (error) {
    await manejarError(error, req, res)
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
    await manejarError(error, req, res)
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
    await manejarError(error, req, res)
  }
};
