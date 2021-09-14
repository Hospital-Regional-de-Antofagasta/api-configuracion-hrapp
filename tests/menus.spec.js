const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
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
const ConfigApiConfiguracion = require("../api/models/ConfigApiConfiguracion");
const configSeed = require("./testSeeds/configSeed.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}`, {
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
  await mongoose.disconnect();
});

describe("Endpoints menus", () => {
  describe("Get menu servicios paciente", () => {
    it("Should get menu servicios paciente from database", async (done) => {
      const response = await request.get(
        "/v1/configuracion-hrapp/menu/servicios-paciente/"
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(5);
      expect(response.body[0].title).toBe("ver mis recetas");
      expect(response.body[1].title).toBe("documentos");
      expect(response.body[2].title).toBe("ver mis horas en laboratorio");

      done();
    });
  });
  describe("Menu Inicio", () => {
    it("Debería obtener el Menu de Inicio desde la base de datos.", async (done) => {
      const response = await request.get("/v1/configuracion-hrapp/menu/inicio");

      expect(response.status).toStrictEqual(200);

      expect(response.body.length).toBe(3);
      expect(response.body[0].title).toBe("Últimas noticias");
      expect(response.body[1].title).toBe("¿Eres paciente?");
      expect(response.body[2].title).toBe("Hospital en tu mano");

      done();
    });
  });
  describe("Get menu documentos", () => {
    it("Should get menu documentos from database", async (done) => {
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

      done();
    });
  });
  describe("Get menu informacion general", () => {
    it("Should get menu informacion general", async (done) => {
      const response = await request.get(
        "/v1/configuracion-hrapp/menu/informacion-general/"
      );

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(3);
      expect(response.body[0].title).toBe("CEFAMS");
      expect(response.body[1].title).toBe("Unidades contigententes");
      expect(response.body[2].title).toBe("Misión y Visión");

      done();
    });
    it("Should get no menu informacion general from empty database", async (done) => {
      await MenuInformacionGeneral.deleteMany();
      const response = await request.get(
        "/v1/configuracion-hrapp/menu/informacion-general/"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);

      done();
    });
  });
  describe("Get menu unidades", () => {
    it("Should get menu unidades", async (done) => {
      const response = await request.get(
        "/v1/configuracion-hrapp/menu/unidades"
      );

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(3);
      expect(response.body[0].title).toBe("Servicios Clínicos");
      expect(response.body[1].title).toBe("Otras Unidades");
      expect(response.body[2].title).toBe("Unidades de Apoyo y Terapéutico");

      done();
    });
    it("Should get no menu unidades from empty database", async (done) => {
      await MenuUnidades.deleteMany();
      const response = await request.get(
        "/v1/configuracion-hrapp/menu/unidades"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);

      done();
    });
  });
  describe("Get menu tabs", () => {
    it("Should get menu tabs", async (done) => {
      const response = await request.get("/v1/configuracion-hrapp/menu/tabs");

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(4);
      expect(response.body[0].title).toBe("inicio");
      expect(response.body[1].title).toBe("Noticias");
      expect(response.body[2].title).toBe("Informaciones");

      done();
    });
    it("Should get no menu tabs from empty database", async (done) => {
      await MenuTabs.deleteMany();
      const response = await request.get("/v1/configuracion-hrapp/menu/tabs");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);

      done();
    });
  });
  describe("Get menus carga inicial", () => {
    it("Should get menus carga inicial", async (done) => {
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

      done();
    });
  });
});
