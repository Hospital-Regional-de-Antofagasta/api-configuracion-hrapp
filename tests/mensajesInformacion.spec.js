const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../api/app");
const mongoose = require("mongoose");
const { getMensajes } = require("../api/config");
const ConfigApiConfiguracion = require("../api/models/ConfigApiConfiguracion");
const configSeed = require("./testSeeds/configSeed.json");
const MensajesInformacion = require("../api/models/MensajesInformacion");
const mensajesInformacionSeed = require("./testSeeds/mensajesInformacionSeed.json");
const AuditLogging = require("../api/models/AuditLogging.js");

const request = supertest(app);

const secretoInterno = process.env.JWT_SECRET_INTERNO;

const user = {
  _id: "61832a43c8a4d50009607cab",
  userName: "admin",
  role: "admin",
};

const tokenInterno = jwt.sign(
  {
    user,
  },
  secretoInterno
);

const tokenInternoSinUsuario = jwt.sign(
  {
    user: {
      _id: "61832a43c8a4d50009607cab",
      userName: "admin",
      role: "",
    },
  },
  secretoInterno
);

const expectAuditLog = async (action) => {
  const registro = await AuditLogging.findOne({
    userName: user.userName,
    userId: user._id,
    action,
  }).exec();

  expect(registro).toBeTruthy();
  expect(registro.affectedData._ids.length).toBe(12);
  expect(registro.createdAt).toBeTruthy();
}

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/mensajes_informacion_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await MensajesInformacion.create(mensajesInformacionSeed);
  await ConfigApiConfiguracion.create(configSeed);
});

afterEach(async () => {
  await MensajesInformacion.deleteMany();
  await ConfigApiConfiguracion.deleteMany();
  await AuditLogging.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoint mensajes informacion", () => {
  describe("Get lista de mensajes de informacion", () => {
    it("Should return empty lista de mensajes de informacion", async () => {
      await MensajesInformacion.deleteMany();

      const response = await request.get(
        "/v1/configuracion-hrapp/mensajes-informacion"
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBeFalsy();
    });
    it("Should return lista de mensajes de informacion", async () => {
      const response = await request.get(
        "/v1/configuracion-hrapp/mensajes-informacion"
      );

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(12);

      expect(response.body[0].pagina).toBe("actualizarDatosPaciente");
      expect(response.body[1].pagina).toBe("detalleReceta");
      expect(response.body[2].pagina).toBe("historicoHorasExamenes");
      expect(response.body[3].pagina).toBe("historicoHorasMedicas");
      expect(response.body[4].pagina).toBe("horasExamenes");
      expect(response.body[5].pagina).toBe("horasMedicas");
      expect(response.body[6].pagina).toBe("inicio");
      expect(response.body[7].pagina).toBe("menuDocumentos");
      expect(response.body[8].pagina).toBe("misionVision");
      expect(response.body[9].pagina).toBe("pases");
      expect(response.body[10].pagina).toBe("serviciosPaciente");
      expect(response.body[11].pagina).toBe("solicitudCita");
    });
  });
  describe("PUT /v1/configuracion-hrapp/mensajes-informacion", () => {
    it("Should not update mensajes de informacion without token", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/mensajes-informacion")
        .send({});

      const mensaje = await getMensajes("forbiddenAccess");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not update mensajes de informacion with invalid token", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/mensajes-informacion")
        .set("Authorization", "no-token")
        .send({});

      const mensaje = await getMensajes("forbiddenAccess");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not update mensajes de informacion with invalid role", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/mensajes-informacion")
        .set("Authorization", tokenInternoSinUsuario)
        .send({});

      const mensaje = await getMensajes("insufficientPermission");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not update mensajes de informacion if it does not exists", async () => {
      await MensajesInformacion.deleteMany();
      const response = await request
        .put("/v1/configuracion-hrapp/mensajes-informacion")
        .set("Authorization", tokenInterno)
        .send([
          {
            pagina: "actualizarDatosPacientee",
            texto: "actualizarDatosPaciente#",
            color: "dager",
          },
          {
            pagina: "detalleReceta",
            texto: "",
            color: "",
          },
          {
            pagina: "historicoHorasExamenes",
            texto: "historicoHorasExamenes",
            color: "info",
          },
          {
            pagina: "historicoHorasMedicas",
            texto: "historicoHorasMedicas",
            color: "info",
          },
          {
            pagina: "horasExamenes",
            texto: "horasExamenes",
            color: "warning",
          },
          {
            pagina: "horasMedicas",
            texto: "horasMedicas",
            color: "info",
          },
          {
            pagina: "inicio",
            texto: "inicio",
            color: "info",
          },
          {
            pagina: "menuDocumentos",
            texto: "menuDocumentos",
            color: "info",
          },
          {
            pagina: "misionVision",
            texto: "misionVision",
            color: "info",
          },
          {
            pagina: "pases",
            texto: "pases",
            color: "info",
          },
          {
            pagina: "serviciosPaciente",
            texto: "serviciosPaciente",
            color: "danger",
          },
          {
            pagina: "solicitudCita",
            texto: "solicitudCita",
            color: "info",
          },
        ]);

      const mensaje = await getMensajes("notFound");

      expect(response.status).toBe(404);
      expect(response.body.respuesta).toEqual({
        titulo: mensaje.titulo,
        mensaje: mensaje.mensaje,
        color: mensaje.color,
        icono: mensaje.icono,
      });
    });
    it("Should not update mensajes de informacion with invalid data", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/mensajes-informacion")
        .set("Authorization", tokenInterno)
        .send([
          {
            pagina: "actualizarDatosPaciente",
            texto: "actualizarDatosPaciente#",
            color: "dager",
          },
          {
            pagina: "detalleReceta",
            texto: "",
            color: "",
          },
          {
            pagina: "historicoHorasExamenes",
            texto: "historicoHorasExamenes",
            color: "info",
          },
          {
            pagina: "historicoHorasMedicas",
            texto: "historicoHorasMedicas",
            color: "info",
          },
          {
            pagina: "horasExamenes",
            texto: "horasExamenes",
            color: "warning",
          },
          {
            pagina: "horasMedicas",
            texto: "horasMedicas",
            color: "info",
          },
          {
            pagina: "inicio",
            texto: "inicio",
            color: "info",
          },
          {
            pagina: "menuDocumentos",
            texto: "menuDocumentos",
            color: "info",
          },
          {
            pagina: "misionVision",
            texto: "misionVision",
            color: "info",
          },
          {
            pagina: "pases",
            texto: "pases",
            color: "info",
          },
          {
            pagina: "serviciosPaciente",
            texto: "serviciosPaciente",
            color: "danger",
          },
          {
            pagina: "solicitudCita",
            texto: "solicitudCita",
            color: "info",
          },
        ]);

      const mensaje = await getMensajes("badRequest");

      expect(response.status).toBe(400);
      expect(response.body.respuesta).toEqual({
        titulo: mensaje.titulo,
        mensaje: mensaje.mensaje,
        color: mensaje.color,
        icono: mensaje.icono,
      });
    });
    it("Should not update mensajes de informacion from invalid data", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/mensajes-informacion")
        .set("Authorization", tokenInterno)
        .send([
          {
            pagina: "actualizarDatosPaciente",
            texto: "actualizarDatosPaciente#",
            color: "dager",
          },
          {
            pagina: "detalleReceta",
            texto: "",
            color: "inf",
          },
          {
            pagina: "historicoHorasExamenes",
            texto: "historicoHorasExamenes",
            color: "info",
          },
          {
            pagina: "historicoHorasMedicas",
            texto: "historicoHorasMedicas",
            color: "info",
          },
          {
            pagina: "horasExamenes",
            texto: "horasExamenes",
            color: "warning",
          },
          {
            pagina: "horasMedicas",
            texto: "horasMedicas",
            color: "info",
          },
          {
            pagina: "inicio",
            texto: "inicio",
            color: "info",
          },
          {
            pagina: "menuDocumentos",
            texto: "menuDocumentos",
            color: "info",
          },
          {
            pagina: "misionVision",
            texto: "misionVision",
            color: "info",
          },
          {
            pagina: "pases",
            texto: "pases",
            color: "info",
          },
          {
            pagina: "serviciosPaciente",
            texto: "serviciosPaciente",
            color: "danger",
          },
          {
            pagina: "solicitudCita",
            texto: "solicitudCita",
            color: "info",
          },
        ]);

      const mensaje = await getMensajes("badRequest");

      expect(response.status).toBe(400);
      expect(response.body.respuesta).toEqual({
        titulo: mensaje.titulo,
        mensaje: mensaje.mensaje,
        color: mensaje.color,
        icono: mensaje.icono,
      });
    });
    it("Should update mensajes de informacion", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/mensajes-informacion")
        .set("Authorization", tokenInterno)
        .send([
          {
            pagina: "actualizarDatosPaciente",
            texto: "solicitudCita",
            color: "info",
          },
          {
            pagina: "detalleReceta",
            texto: "",
            color: "warning",
          },
          {
            pagina: "historicoHorasExamenes",
            texto: "pases",
            color: "info",
          },
          {
            pagina: "historicoHorasMedicas",
            texto: "",
            color: "info",
          },
          {
            pagina: "horasExamenes",
            texto: "menuDocumentos",
            color: "warning",
          },
          {
            pagina: "horasMedicas",
            texto: "",
            color: "info",
          },
          {
            pagina: "inicio",
            texto: "horasMedicas",
            color: "info",
          },
          {
            pagina: "menuDocumentos",
            texto: "horasExamenes",
            color: "info",
          },
          {
            pagina: "misionVision",
            texto: "historicoHorasMedicas",
            color: "info",
          },
          {
            pagina: "pases",
            texto: "historicoHorasExamenes",
            color: "info",
          },
          {
            pagina: "serviciosPaciente",
            texto: "detalleReceta",
            color: "danger",
          },
          {
            pagina: "solicitudCita",
            texto: "actualizarDatosPaciente",
            color: "info",
          },
        ]);

      const mensaje = await getMensajes("success");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });

      const mensajesInformacion = await MensajesInformacion.find()
        .sort({ pagina: 1 })
        .exec();

      expect(mensajesInformacion.length).toBe(12);

      expect(mensajesInformacion[0].texto).toBe("solicitudCita");
      expect(mensajesInformacion[0].color).toBe("info");
      expect(mensajesInformacion[1].texto).toBe("");
      expect(mensajesInformacion[1].color).toBe("warning");
      expect(mensajesInformacion[2].texto).toBe("pases");
      expect(mensajesInformacion[2].color).toBe("info");
      expect(mensajesInformacion[3].texto).toBe("");
      expect(mensajesInformacion[4].texto).toBe("menuDocumentos");
      expect(mensajesInformacion[5].texto).toBe("");
      expect(mensajesInformacion[6].texto).toBe("horasMedicas");
      expect(mensajesInformacion[7].texto).toBe("horasExamenes");
      expect(mensajesInformacion[8].texto).toBe("historicoHorasMedicas");
      expect(mensajesInformacion[9].texto).toBe("historicoHorasExamenes");
      expect(mensajesInformacion[10].texto).toBe("detalleReceta");
      expect(mensajesInformacion[11].texto).toBe("actualizarDatosPaciente");

      await expectAuditLog("PUT /v1/configuracion-hrapp/mensajes-informacion");
    });
  });
});
