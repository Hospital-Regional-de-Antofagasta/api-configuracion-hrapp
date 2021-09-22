const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const Unidades = require("../api/models/Unidades");
const unidadesSeed = require("./testSeeds/unidadesSeed.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/unidades_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Unidades.create(unidadesSeed);
});

afterEach(async () => {
  await Unidades.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints unidades", () => {
  describe("Get unidades", () => {
    it("Should get unidades", async (done) => {
      const response = await request.get(`/v1/configuracion-hrapp/unidades`);

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(4);
      expect(response.body[0].nombre).toBe("Pediatría");
      expect(response.body[1].nombre).toBe("Unidad serviciosClinicos");
      expect(response.body[2].nombre).toBe("Laboratorio Clínico");
      expect(response.body[3].nombre).toBe("Unidad unidadesApoyo");

      done();
    });
    it("Should get unidades por tipo", async (done) => {
      const response = await request.get(
        `/v1/configuracion-hrapp/unidades?tipo=serviciosClinicos`
      );

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(3);
      expect(response.body[0].nombre).toBe("Pediatría");
      expect(response.body[1].nombre).toBe("Unidad serviciosClinicos");
      expect(response.body[2].nombre).toBe("Laboratorio Clínico");

      done();
    });
    it("Should get no unidades from empty database", async (done) => {
      await Unidades.deleteMany();
      const response = await request.get("/v1/configuracion-hrapp/unidades");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);

      done();
    });
  });
});
