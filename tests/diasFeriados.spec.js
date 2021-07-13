const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../api/index");
const DiasFeriados = require("../models/DiasFeriados");
const diasFeriados = require("../api/testSeeds/diasFeriadosSeeds.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}ubicaciones`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await DiasFeriados.create(diasFeriados);
});

afterEach(async () => {
  await DiasFeriados.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoint dias feriados", () => {
  describe("Get lista de dias feriados", () => {
    it("Should return lista de dias feriados", async (done) => {
      const response = await request.get(
        "/v1/configuracion_hrapp/dias_feriados/"
      );

      const diasFeriadosObtenidos = await DiasFeriados.find().exec();

      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(diasFeriadosObtenidos.length);

      done();
    });
    it("Should return empty lista de dias feriados", async (done) => {
      await DiasFeriados.deleteMany();

      const response = await request.get(
        "/v1/configuracion_hrapp/dias_feriados"
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBeFalsy();

      done();
    });
  });
});
