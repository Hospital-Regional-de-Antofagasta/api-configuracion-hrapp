const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const ConfiguracionHRApp = require("../models/ConfiguracionHRApp");
const configuracionHRAppSeed = require("../api/testSeeds/configuracionHRAppSeed.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}configuracion_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await ConfiguracionHRApp.create(configuracionHRAppSeed);
});

afterEach(async () => {
  await ConfiguracionHRApp.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints menus", () => {
  describe("Get configuracion de la HRApp", () => {
    it("Should get configuracion de la HRApp from database", async (done) => {
      const response = await request.get("/v1/configuracion-hrapp");

      expect(response.status).toBe(200);

      expect(response.body).toBeTruthy();

      expect(
        response.body.funcionalidadesHabilitadas.horasMedicas.solicitudAnular
      ).toBe(true);
      expect(
        response.body.funcionalidadesHabilitadas.horasMedicas.solicitudCambiar
      ).toBe(true);

      expect(
        response.body.funcionalidadesHabilitadas.horasExamenes.solicitudAnular
      ).toBe(false);
      expect(
        response.body.funcionalidadesHabilitadas.horasExamenes.solicitudCambiar
      ).toBe(false);

      expect(
        response.body.parametrosEndpoints.documentosPacientes.cantidadAObtener
      ).toBe(5);

      expect(response.body.textosApp.nombreApp).toBe("Hospital En Tus Manos");
      expect(response.body.textosApp.mensajeBienvenida).toBe("Bienvenido");

      done();
    });
  });
});
