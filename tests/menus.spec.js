const supertest = require("supertest");
const app = require("../api/index");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const MenuServiciosPaciente = require("../models/MenuServiciosPaciente");
const menuServiciosPacienteSeed = require("../api/testSeeds/menuServiciosPacienteSeed.json");
const MenuInicio = require("../models/MenuInicio");
const menuInicioSeed = require("../api/testSeeds/menuInicioSeed.json");
const MenuDocumentos = require("../models/MenuDocumentos");
const menuDocumentosSeed = require("../api/testSeeds/menuDocumentosSeed.json");
const { getMensajes } = require("../api/config");
const ConfigApiConfiguracion = require("../models/ConfigApiConfiguracion");
const configSeed = require("../api/testSeeds/configSeed.json");

const request = supertest(app);

const secreto = process.env.JWT_SECRET;
let token;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}menus_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await MenuServiciosPaciente.create(menuServiciosPacienteSeed);
  await MenuInicio.create(menuInicioSeed);
  await MenuDocumentos.create(menuDocumentosSeed);
  await ConfigApiConfiguracion.create(configSeed);
});

afterEach(async () => {
  await MenuServiciosPaciente.deleteMany();
  await MenuInicio.deleteMany();
  await MenuDocumentos.deleteMany();
  await ConfigApiConfiguracion.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints menus", () => {
  describe("Get menu servicios paciente", () => {
    it("Should get menu servicios paciente from database", async (done) => {
      const response = await request.get(
        "/v1/configuracion-hrapp/menu/servicios-paciente/"
      );

      const menuServiciosPacienteObtenidos =
        await MenuServiciosPaciente.find().exec();

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        menuServiciosPacienteObtenidos.length - 1
      );
      expect(response.body[0].posicion).toBe(
        menuServiciosPacienteObtenidos[0].posicion
      );
      expect(response.body[1].posicion).toBe(
        menuServiciosPacienteObtenidos[3].posicion
      );

      done();
    });
  });
  describe("Menu Inicio", () => {
    it("Debería obtener el Menu de Inicio desde la base de datos.", async (done) => {
      const respuesta = await request.get(
        "/v1/configuracion-hrapp/menu/inicio"
      );

      expect(respuesta.status).toStrictEqual(200);

      const menuInicioObtenido = respuesta.body;
      expect(menuInicioObtenido.length).toStrictEqual(3);

      const primeraOpcion = menuInicioObtenido[0];
      const segundaOpcion = menuInicioObtenido[1];
      const terceraOpcion = menuInicioObtenido[2];
      expect(primeraOpcion.icono).toStrictEqual("newspaper");
      expect(primeraOpcion.title).toStrictEqual("Últimas noticias");
      expect(primeraOpcion.redirecTo).toStrictEqual("/tabs");
      expect(primeraOpcion.tipo).toStrictEqual("noticia");
      expect(primeraOpcion.posicion).toStrictEqual(1);

      expect(segundaOpcion.icono).toStrictEqual("medkit");
      expect(segundaOpcion.title).toStrictEqual("¿Eres paciente?");
      expect(segundaOpcion.redirecTo).toStrictEqual("");
      expect(segundaOpcion.tipo).toStrictEqual("paciente");
      expect(segundaOpcion.posicion).toStrictEqual(2);

      expect(terceraOpcion.icono).toStrictEqual("business");
      expect(terceraOpcion.title).toStrictEqual("Hospital en tu mano");
      expect(terceraOpcion.redirecTo).toStrictEqual("/tabs");
      expect(terceraOpcion.tipo).toStrictEqual("hra");
      expect(terceraOpcion.posicion).toStrictEqual(3);
      done();
    });
  });
  describe("Get menu documentos", () => {
    it("Should not get menu documentos from database", async (done) => {
      const response = await request
        .get("/v1/configuracion-hrapp/menu/documentos/")
        .set("Authorization", "no-token");

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

      done();
    });
    it("Should get menu documentos from database", async (done) => {
      token = jwt.sign({ numeroPaciente: 2 }, secreto);
      const response = await request
        .get("/v1/configuracion-hrapp/menu/documentos/")
        .set("Authorization", token);

      const menuDocumentosObtenidos = await MenuDocumentos.find().exec();

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(menuDocumentosObtenidos.length - 1);
      expect(response.body[0].posicion).toBe(
        menuDocumentosObtenidos[0].posicion
      );
      expect(response.body[1].posicion).toBe(
        menuDocumentosObtenidos[2].posicion
      );

      done();
    });
  });
});
