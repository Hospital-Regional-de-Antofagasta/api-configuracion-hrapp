const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../api/app");
const mongoose = require("mongoose");
const { getMensajes } = require("../api/config");
const ConfigApiConfiguracion = require("../api/models/ConfigApiConfiguracion");
const configSeed = require("./testSeeds/configSeed.json");
const MenuServiciosPaciente = require("../api/models/MenuServiciosPaciente");
const menuServiciosPacienteSeed = require("./testSeeds/menuServiciosPacienteSeed.json");
const MenuInicio = require("../api/models/MenuInicio");
const menuInicioSeed = require("./testSeeds/menuInicioSeed.json");
const MenuDocumentos = require("../api/models/MenuDocumentos");
const menuDocumentosSeed = require("./testSeeds/menuDocumentosSeed.json");
const MenuInformacionGeneral = require("../api/models/MenuInformacionGeneral");
const menuInformacionGeneralSeed = require("./testSeeds/menuInformacionGeneralSeed.json");
const MenuUnidades = require("../api/models/MenuUnidades");
const menuUnidadesSeed = require("./testSeeds/menuUnidadesSeed.json");
const MenuTabs = require("../api/models/MenuTabs");
const menuTabsSeed = require("./testSeeds/menuTabsSeed.json");
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
  expect(registro.affectedData._id).toBeTruthy();
  expect(registro.createdAt).toBeTruthy();
}

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/menus_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await MenuServiciosPaciente.create(menuServiciosPacienteSeed);
  await MenuInicio.create(menuInicioSeed);
  await MenuDocumentos.create(menuDocumentosSeed);
  await MenuInformacionGeneral.create(menuInformacionGeneralSeed);
  await MenuUnidades.create(menuUnidadesSeed);
  await MenuTabs.create(menuTabsSeed);
  await ConfigApiConfiguracion.create(configSeed);
});

afterEach(async () => {
  await MenuServiciosPaciente.deleteMany();
  await MenuInicio.deleteMany();
  await MenuDocumentos.deleteMany();
  await MenuInformacionGeneral.deleteMany();
  await MenuUnidades.deleteMany();
  await MenuTabs.deleteMany();
  await ConfigApiConfiguracion.deleteMany();
  await AuditLogging.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints menus", () => {
  describe("Get menu servicios paciente", () => {
    it("Should get menu servicios paciente from database", async () => {
      const response = await request.get(
        "/v1/configuracion-hrapp/menu/servicios-paciente/"
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(5);
      expect(response.body[0].title).toBe("ver mis recetas");
      expect(response.body[1].title).toBe("documentos");
      expect(response.body[2].title).toBe("ver mis horas en laboratorio");
    });
  });
  describe("Menu Inicio", () => {
    it("Debería obtener el Menu de Inicio desde la base de datos.", async () => {
      const response = await request.get("/v1/configuracion-hrapp/menu/inicio");

      expect(response.status).toStrictEqual(200);

      expect(response.body.length).toBe(3);
      expect(response.body[0].title).toBe("Últimas noticias");
      expect(response.body[1].title).toBe("¿Eres paciente?");
      expect(response.body[2].title).toBe("Hospital en tu mano");
    });
  });
  describe("Get menu documentos", () => {
    it("Should get menu documentos from database", async () => {
      const response = await request.get(
        "/v1/configuracion-hrapp/menu/documentos/"
      );

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(3);
      expect(response.body[0].title).toBe(
        "ver mis Documentos de Atención de Urgencias"
      );
      expect(response.body[1].title).toBe("Solicitar mi última Epicrisis");
      expect(response.body[2].title).toBe("ver mis horas médicas");
    });
  });
  describe("Get menu informacion general", () => {
    it("Should get menu informacion general", async () => {
      const response = await request.get(
        "/v1/configuracion-hrapp/menu/informacion-general/"
      );

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(3);
      expect(response.body[0].title).toBe("CEFAMS");
      expect(response.body[1].title).toBe("Unidades contigententes");
      expect(response.body[2].title).toBe("Misión y Visión");
    });
    it("Should get no menu informacion general from empty database", async () => {
      await MenuInformacionGeneral.deleteMany();
      const response = await request.get(
        "/v1/configuracion-hrapp/menu/informacion-general/"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
  describe("Get menu unidades", () => {
    describe("GET /v1/configuracion-hrapp/menu/unidades", () => {
      it("Should get no menu unidades from empty database", async () => {
        await MenuUnidades.deleteMany();
        const response = await request.get(
          "/v1/configuracion-hrapp/menu/unidades"
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });
      it("Should get menu unidades", async () => {
        const response = await request.get(
          "/v1/configuracion-hrapp/menu/unidades"
        );

        expect(response.status).toBe(200);

        expect(response.body.length).toBe(3);
        expect(response.body[0].title).toBe("Servicios Clínicos");
        expect(response.body[1].title).toBe("Otras Unidades");
        expect(response.body[2].title).toBe("Unidades de Apoyo y Terapéutico");
      });
      it("Should get menu unidades without disabled items", async () => {
        const response = await request.get(
          "/v1/configuracion-hrapp/menu/unidades?incluirDeshabilitados=false"
        );

        expect(response.status).toBe(200);

        expect(response.body.length).toBe(3);
        expect(response.body[0].title).toBe("Servicios Clínicos");
        expect(response.body[1].title).toBe("Otras Unidades");
        expect(response.body[2].title).toBe("Unidades de Apoyo y Terapéutico");
      });
      it("Should get menu unidades with disabled items", async () => {
        const response = await request.get(
          "/v1/configuracion-hrapp/menu/unidades?incluirDeshabilitados=true"
        );

        expect(response.status).toBe(200);

        expect(response.body.length).toBe(4);
        expect(response.body[0].title).toBe("Servicios Clínicos");
        expect(response.body[1].title).toBe("Otras Unidades");
        expect(response.body[2].title).toBe("Unidades de Apoyo y Terapéutico");
        expect(response.body[3].title).toBe("deshabilitado");
      });
    });
    describe("POST /v1/configuracion-hrapp/menu/unidades", () => {
      it("Should not create item for menu unidades without token", async () => {
        const response = await request
          .post("/v1/configuracion-hrapp/menu/unidades")
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
      it("Should not create item for menu unidades with invalid token", async () => {
        const response = await request
          .post("/v1/configuracion-hrapp/menu/unidades")
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
      it("Should not create item for menu unidades with invalid role", async () => {
        const response = await request
          .post("/v1/configuracion-hrapp/menu/unidades")
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
      it("Should not create item for menu unidades from empty data", async () => {
        await MenuUnidades.deleteMany();
        const response = await request
          .post("/v1/configuracion-hrapp/menu/unidades")
          .set("Authorization", tokenInterno)
          .send({});

        const mensaje = await getMensajes("badRequest");

        expect(response.status).toBe(400);
        expect(response.body.respuesta).toEqual({
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        });
      });
      it("Should not create item for menu unidades with incomplete data", async () => {
        const response = await request
          .post("/v1/configuracion-hrapp/menu/unidades")
          .set("Authorization", tokenInterno)
          .send({
            icono: "user-nurse",
            title: "Otras Unidades",
            tipo: "unidadesApoyo",
            habilitado: true,
            posicion: 2,
          });

        const mensaje = await getMensajes("badRequest");

        expect(response.status).toBe(400);
        expect(response.body.respuesta).toEqual({
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        });
      });
      it("Should not create item for menu unidades with invalid data", async () => {
        const response = await request
          .post("/v1/configuracion-hrapp/menu/unidades")
          .set("Authorization", tokenInterno)
          .send({
            icono: "user-nurse#",
            title: "Otras Unidades",
            subtitle:
              "Conoce información relevante respecto a todas las unidades",
            tipo: "unidadesApoyo",
            habilitado: true,
            posicion: 2,
          });

        const mensaje = await getMensajes("badRequest");

        expect(response.status).toBe(400);
        expect(response.body.respuesta).toEqual({
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        });
      });
      it("Should create item for menu unidades", async () => {
        const response = await request
          .post("/v1/configuracion-hrapp/menu/unidades")
          .set("Authorization", tokenInterno)
          .send({
            icono: "new-icon",
            title: "Títul o",
            subtitle: "Subtítulo",
            tipo: "tipo",
            habilitado: true,
            posicion: 5,
          });

        const mensaje = await getMensajes("created");

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          respuesta: {
            titulo: mensaje.titulo,
            mensaje: mensaje.mensaje,
            color: mensaje.color,
            icono: mensaje.icono,
          },
        });

        const item = await MenuUnidades.findOne({ title: "Títul o" }).exec();

        expect(item.icono).toBe("new-icon");
        expect(item.title).toBe("Títul o");
        expect(item.subtitle).toBe("Subtítulo");
        expect(item.tipo).toBe("tipo");
        expect(item.habilitado).toBe(true);
        expect(item.implementado).toBe(true);
        expect(item.mensajeImplementado).toBe("En construcción");
        expect(item.posicion).toBe(5);
        expect(item.version).toBe(1);
        expect(item.redirecTo).toBe(
          `tabs/tab3/menu-prestaciones/unidades?tipo=${
            item.tipo
          }&titulo=${item.title.replace(" ", "+")}`
        );

        await expectAuditLog("POST /v1/configuracion-hrapp/menu/unidades");
      });
    });
    describe("PUT /v1/configuracion-hrapp/menu/unidades/:_id", () => {
      it("Should not update item for menu unidades without token", async () => {
        const response = await request
          .put("/v1/configuracion-hrapp/menu/unidades/67832a43c8a5d50009607cab")
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
      it("Should not update item for menu unidades with invalid token", async () => {
        const response = await request
          .put("/v1/configuracion-hrapp/menu/unidades/67832a43c8a5d50009607cab")
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
      it("Should not update item for menu unidades with invalid role", async () => {
        const response = await request
          .put("/v1/configuracion-hrapp/menu/unidades/67832a43c8a5d50009607cab")
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
      it("Should not update item for menu unidades if it does not exists", async () => {
        await MenuUnidades.deleteMany();
        const response = await request
          .put("/v1/configuracion-hrapp/menu/unidades/67832a43c8a5d50009607cab")
          .set("Authorization", tokenInterno)
          .send({});

        const mensaje = await getMensajes("notFound");

        expect(response.status).toBe(404);
        expect(response.body.respuesta).toEqual({
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        });
      });
      it("Should not update item for menu unidades with invalid data", async () => {
        const response = await request
          .put("/v1/configuracion-hrapp/menu/unidades/67832a43c8a5d50009607cab")
          .set("Authorization", tokenInterno)
          .send({
            icono: "user-nurse",
            title: "",
            tipo: "unidadesApoyo",
            posicion: 2,
          });

        const mensaje = await getMensajes("badRequest");

        expect(response.status).toBe(400);
        expect(response.body.respuesta).toEqual({
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        });
      });
      it("Should not update item for menu unidades from invalid data", async () => {
        const response = await request
          .put("/v1/configuracion-hrapp/menu/unidades/67832a43c8a5d50009607cab")
          .set("Authorization", tokenInterno)
          .send({
            icono: "user-nurse#",
          });

        const mensaje = await getMensajes("badRequest");

        expect(response.status).toBe(400);
        expect(response.body.respuesta).toEqual({
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        });
      });
      it("Should update item for menu unidades", async () => {
        const response = await request
          .put("/v1/configuracion-hrapp/menu/unidades/67832a43c8a5d50009607cab")
          .set("Authorization", tokenInterno)
          .send({
            icono: "new-icon",
            subtitle: "Subtítulo",
          });

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

        const item = await MenuUnidades.findOne({
          _id: "67832a43c8a5d50009607cab",
        }).exec();

        expect(item.icono).toBe("new-icon");
        expect(item.title).toBe("Otras Unidades");
        expect(item.subtitle).toBe("Subtítulo");
        expect(item.tipo).toBe("unidadesApoyo");
        expect(item.habilitado).toBe(true);
        expect(item.implementado).toBe(true);
        expect(item.mensajeImplementado).toBe("En construcción");
        expect(item.posicion).toBe(2);
        expect(item.version).toBe(1);
        expect(item.redirecTo).toBe(
          `tabs/tab3/menu-prestaciones/unidades?tipo=${
            item.tipo
          }&titulo=${item.title.replace(" ", "+")}`
        );

        await expectAuditLog("PUT /v1/configuracion-hrapp/menu/unidades/:_id");
      });
    });
    describe("DELETE /v1/configuracion-hrapp/menu/unidades", () => {
      it("Should not delete item for menu unidades without token", async () => {
        const response = await request
          .delete(
            "/v1/configuracion-hrapp/menu/unidades/67832a43c8a5d50009607cab"
          )
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
      it("Should not delete item for menu unidades with invalid token", async () => {
        const response = await request
          .delete(
            "/v1/configuracion-hrapp/menu/unidades/67832a43c8a5d50009607cab"
          )
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
      it("Should not delete item for menu unidades with invalid token", async () => {
        const response = await request
          .delete(
            "/v1/configuracion-hrapp/menu/unidades/67832a43c8a5d50009607cab"
          )
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
      it("Should not delete item for menu unidades if it does not exists", async () => {
        await MenuUnidades.deleteMany();
        const response = await request
          .delete(
            "/v1/configuracion-hrapp/menu/unidades/67832a43c8a5d50009607cab"
          )
          .set("Authorization", tokenInterno)
          .send({});

        const mensaje = await getMensajes("notFound");

        expect(response.status).toBe(404);
        expect(response.body.respuesta).toEqual({
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        });
      });
      it("Should delete item for menu unidades", async () => {
        const response = await request
          .delete(
            "/v1/configuracion-hrapp/menu/unidades/67832a43c8a5d50009607cab"
          )
          .set("Authorization", tokenInterno);

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

        const item = await MenuUnidades.findOne({
          _id: "67832a43c8a5d50009607cab",
        }).exec();

        expect(item).toBeFalsy();

        await expectAuditLog("DELETE /v1/configuracion-hrapp/menu/unidades/:_id");
      });
    });
  });
  describe("Get menu tabs", () => {
    it("Should get menu tabs", async () => {
      const response = await request.get("/v1/configuracion-hrapp/menu/tabs");

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(4);
      expect(response.body[0].title).toBe("inicio");
      expect(response.body[1].title).toBe("Noticias");
      expect(response.body[2].title).toBe("Informaciones");
    });
    it("Should get no menu tabs from empty database", async () => {
      await MenuTabs.deleteMany();
      const response = await request.get("/v1/configuracion-hrapp/menu/tabs");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
  describe("Get menus carga inicial", () => {
    it("Should get menus carga inicial", async () => {
      const response = await request.get(
        "/v1/configuracion-hrapp/menu/carga-inicial"
      );

      expect(response.status).toBe(200);
      // menu servicios paciente
      expect(response.body.menuServiciosPaciente.length).toBe(5);
      expect(response.body.menuServiciosPaciente[0].title).toBe(
        "ver mis recetas"
      );
      expect(response.body.menuServiciosPaciente[1].title).toBe("documentos");
      expect(response.body.menuServiciosPaciente[2].title).toBe(
        "ver mis horas en laboratorio"
      );
      // menu inicio
      expect(response.body.menuInicio.length).toBe(3);
      expect(response.body.menuInicio[0].title).toBe("Últimas noticias");
      expect(response.body.menuInicio[1].title).toBe("¿Eres paciente?");
      expect(response.body.menuInicio[2].title).toBe("Hospital en tu mano");
      // menu documentos
      // expect(response.body.menuDocumentos.length).toBe(3);
      // expect(response.body.menuDocumentos[0].title).toBe(
      //   "ver mis Documentos de Atención de Urgencias"
      // );
      // expect(response.body.menuDocumentos[1].title).toBe(
      //   "Solicitar mi última Epicrisis"
      // );
      // expect(response.body.menuDocumentos[2].title).toBe(
      //   "ver mis horas médicas"
      // );
      // menu informacion general
      expect(response.body.menuInformacionGeneral.length).toBe(3);
      expect(response.body.menuInformacionGeneral[0].title).toBe("CEFAMS");
      expect(response.body.menuInformacionGeneral[1].title).toBe(
        "Unidades contigententes"
      );
      expect(response.body.menuInformacionGeneral[2].title).toBe(
        "Misión y Visión"
      );
      // menu unidades
      expect(response.body.menuUnidades.length).toBe(3);
      expect(response.body.menuUnidades[0].title).toBe("Servicios Clínicos");
      expect(response.body.menuUnidades[1].title).toBe("Otras Unidades");
      expect(response.body.menuUnidades[2].title).toBe(
        "Unidades de Apoyo y Terapéutico"
      );
      // menu tabs
      expect(response.body.menuTabs.length).toBe(4);
      expect(response.body.menuTabs[0].title).toBe("inicio");
      expect(response.body.menuTabs[1].title).toBe("Noticias");
      expect(response.body.menuTabs[2].title).toBe("Informaciones");
    });
  });
});
