const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../api/index");
const Regiones = require("../models/Regiones");
// const Provincias = require("../api/models/Provincias");
const Ciudades = require("../models/Ciudades");
// const Comunas = require("../api/models/Comunas");
const regionesSeed = require("../api/testSeeds/regionesSeed");
// const provinciasSeed = require("../api/testSeeds/provinciasSeed");
const ciudadesSeed = require("../api/testSeeds/ciudadesSeed");
// const comunasSeed = require("../api/testSeeds/comunasSeed");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}ubicaciones_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Regiones.create(regionesSeed);
  // await Provincias.create(provinciasSeed);
  await Ciudades.create(ciudadesSeed);
  // await Comunas.create(comunasSeed);
});

afterEach(async () => {
  await Regiones.deleteMany();
  // await Provincias.deleteMany();
  await Ciudades.deleteMany();
  // await Comunas.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints ubicaciones", () => {
  describe("Get lista de ubicaciones", () => {
    it("Should return lista de ubicaciones", async (done) => {
      const response = await request.get(
        "/v1/configuracion_hrapp/ubicaciones/"
      );

      const regionesObtenidas = await Regiones.find().exec();
      // const provinciasObtenidas = await Provincias.find().exec();
      const ciudadesObtenidas = await Ciudades.find().exec();
      // const comunasObtenidas = await Comunas.find().exec();

      expect(response.status).toBe(200);
      expect(response.body[0].length).toEqual(regionesObtenidas.length);
      // expect(response.body[1].length).toEqual(provinciasObtenidas.length);
      expect(response.body[1].length).toEqual(ciudadesObtenidas.length);
      // expect(response.body[3].length).toEqual(comunasObtenidas.length);

      done();
    });
    it("Should return empty lista de ubicaciones", async (done) => {
      await Regiones.deleteMany();
      // await Provincias.deleteMany();
      await Ciudades.deleteMany();
      // await Comunas.deleteMany();

      const response = await request.get(
        "/v1/configuracion_hrapp/ubicaciones/"
      );

      expect(response.status).toBe(200);
      expect(response.body[0].length).toBeFalsy();
      // expect(response.body[1].length).toBeFalsy();
      expect(response.body[1].length).toBeFalsy();
      // expect(response.body[3].length).toBeFalsy();

      done();
    });
  });
});
