const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const DiccionarioDispositivos = require("../api/models/DiccionarioDispositivos");
const diccionarioDispositivosSeed = require("./testSeeds/diccionarioDispositivosSeed.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(
    `${process.env.MONGO_URI}/diccionario_dispositivos_test`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  await DiccionarioDispositivos.create(diccionarioDispositivosSeed);
});

afterEach(async () => {
  await DiccionarioDispositivos.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints diccionario dispositivos", () => {
  describe("GET /v1/configuracion-hrapp/diccionario_dispositivos/:idDispositivo", () => {
    it("Debería retornar el idDispositivo si el idDispositivo no existe.", async () => {
      const response = await request.get(
        `/v1/configuracion-hrapp/diccionario_dispositivos/idDispositivo`
      );

      expect(response.status).toBe(200);
      expect(response.body.nombre).toBe("idDispositivo");
    });
    it("Debería retornar el nombre del dispositivo.", async () => {
      const response = await request.get(
        `/v1/configuracion-hrapp/diccionario_dispositivos/SM-G973F`
      );

      expect(response.status).toBe(200);
      expect(response.body.nombre).toBe("Galaxy S10");
    });
  });
});
