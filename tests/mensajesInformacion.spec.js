const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../api/app");
const MensajesInformacion = require("../models/MensajesInformacion");
const mensajesInformacionSeed = require("../api/testSeeds/mensajesInformacionSeed.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(
    `${process.env.MONGO_URI_TEST}mensajes-informacion_test`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  await MensajesInformacion.create(mensajesInformacionSeed);
});

afterEach(async () => {
  await MensajesInformacion.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoint mensajes informacion", () => {
  describe("Get lista de mensajes de informacion", () => {
    it("Should return lista de mensajes de informacion", async (done) => {
      const response = await request.get(
        "/v1/configuracion-hrapp/mensajes-informacion/"
      );

      const mensajesInformacionObtenidos =
        await MensajesInformacion.find().exec();

      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(mensajesInformacionObtenidos.length);

      done();
    });
    it("Should return empty lista de mensajes de informacion", async (done) => {
      await MensajesInformacion.deleteMany();

      const response = await request.get(
        "/v1/configuracion-hrapp/mensajes-informacion"
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBeFalsy();

      done();
    });
  });
});
