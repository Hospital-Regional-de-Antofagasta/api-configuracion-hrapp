const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../api/app");
const Regiones = require("../api/models/Regiones");
const Ciudades = require("../api/models/Ciudades");
const regionesSeed = require("./testSeeds/regionesSeed.json");
const ciudadesSeed = require("./testSeeds/ciudadesSeed.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Regiones.create(regionesSeed);
  await Ciudades.create(ciudadesSeed);
});

afterEach(async () => {
  await Regiones.deleteMany();
  await Ciudades.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints ubicaciones", () => {
  describe("Get lista de ubicaciones", () => {
    it("Should return lista de ubicaciones", async (done) => {
      const response = await request.get(
        "/v1/configuracion-hrapp/ubicaciones/"
      );

      const regionesObtenidas = await Regiones.find().exec();
      const ciudadesObtenidas = await Ciudades.find().exec();

      expect(response.status).toBe(200);
      expect(response.body[0].length).toEqual(regionesObtenidas.length);
      expect(response.body[1].length).toEqual(ciudadesObtenidas.length);

      done();
    });
    it("Should return empty lista de ubicaciones", async (done) => {
      await Regiones.deleteMany();
      await Ciudades.deleteMany();

      const response = await request.get(
        "/v1/configuracion-hrapp/ubicaciones/"
      );

      expect(response.status).toBe(200);
      expect(response.body[0].length).toBeFalsy();
      expect(response.body[1].length).toBeFalsy();

      done();
    });
  });
});
