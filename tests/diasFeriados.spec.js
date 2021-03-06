const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../api/app");
const DiasFeriados = require("../api/models/DiasFeriados");
const diasFeriados = require("./testSeeds/diasFeriadosSeeds.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/dias_feriados_test`, {
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
        "/v1/configuracion-hrapp/dias-feriados/"
      );

      const diasFeriadosObtenidos = await DiasFeriados.find().exec();

      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(diasFeriadosObtenidos.length);

      done();
    });
    it("Should return empty lista de dias feriados", async (done) => {
      await DiasFeriados.deleteMany();

      const response = await request.get(
        "/v1/configuracion-hrapp/dias-feriados"
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBeFalsy();

      done();
    });
  });
});
