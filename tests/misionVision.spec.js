const supertest = require("supertest");
const app = require("../api/index");
const mongoose = require("mongoose");
const MisionVision = require("../models/MisionVision");
const misionVisionSeed = require("../api/testSeeds/misionVisionSeed.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}menus_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await MisionVision.create(misionVisionSeed);
});

afterEach(async () => {
  await MisionVision.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints mision vision", () => {
  describe("Get mision y vision", () => {
    it("Should get mision y vision", async (done) => {
      const response = await request.get(
        "/v1/configuracion-hrapp/mision-vision/"
      );

      expect(response.status).toBe(200);

      expect(response.body.mision.titulo).toEqual("titulo mision");
      expect(response.body.mision.texto).toEqual("texto mision");
      expect(response.body.mision.icono).toEqual("icono mision");

      expect(response.body.vision.titulo).toEqual("titulo vision");
      expect(response.body.vision.texto).toEqual("texto vision");
      expect(response.body.vision.icono).toEqual("icono vision");

      done();
    });
    it("Should get no mision y vision from empty database", async (done) => {
      await MisionVision.deleteMany();
      const response = await request.get(
        "/v1/configuracion-hrapp/mision-vision/"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});

      done();});
  });
});
