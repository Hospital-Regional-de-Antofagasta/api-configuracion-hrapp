const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const DiccionarioSiglas = require("../models/DiccionarioSiglas");
const diccionarioSiglasSeed = require("../testSeeds/diccionarioSiglasSeed.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}diccionario_siglas_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await DiccionarioSiglas.create(diccionarioSiglasSeed);
});

afterEach(async () => {
  await DiccionarioSiglas.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints diccionario siglas", () => {
  describe("Get diccionario siglas", () => {
    it("Should get diccionario siglas", async (done) => {
      const response = await request.get(`/v1/configuracion-hrapp/diccionario-siglas`);

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(3);
      expect(response.body[0].siglaComparacion).toBe("cae");
      expect(response.body[0].sigla).toBe("CAE");
      expect(response.body[1].siglaComparacion).toBe("cao");
      expect(response.body[1].sigla).toBe("CAO");
      expect(response.body[2].siglaComparacion).toBe("cau");
      expect(response.body[2].sigla).toBe("CAU");

      done();
    });
    it("Should get no diccionario siglas from empty database", async (done) => {
      await DiccionarioSiglas.deleteMany();
      const response = await request.get("/v1/configuracion-hrapp/diccionario-siglas");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);

      done();
    });
  });
});
