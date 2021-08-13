const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const SeccionAyuda = require("../models/SeccionAyuda");
const seccionAyudaSeed = require("../testSeeds/seccionAyudaSeed.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}menus_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await SeccionAyuda.create(seccionAyudaSeed);
});

afterEach(async () => {
  await SeccionAyuda.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints seccion ayuda", () => {
  describe("Get seccion ayuda", () => {
    it("Should get seccion ayuda de pagina documentos", async (done) => {
      const response = await request.get(`/v1/configuracion-hrapp/seccion-ayuda?pagina=documentos`);

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(4);
      expect(response.body[0].preguntas[0].texto).toBe("¿Como Solicito un documento?");
      expect(response.body[1].preguntas[0].texto).toBe("¿Como Solicito un documento?");
      expect(response.body[2].preguntas[0].texto).toBe("¿Cuantas veces puedo solicitar un documento?");
      expect(response.body[3].preguntas[0].texto).toBe("¿Cuanto tarda en llegar el documento una vez solicitado?");

      expect(response.body[0].titulo).toBe("¿Necesitas Ayuda?");

      expect(response.body[0].preguntas[0].texto).toBe("¿Como Solicito un documento?");
      expect(response.body[0].preguntas[0].slide).toBe(1);
      expect(response.body[0].preguntas[1].texto).toBe("¿Cuantas veces puedo solicitar un documento?");
      expect(response.body[0].preguntas[1].slide).toBe(2);
      expect(response.body[0].preguntas[2].texto).toBe("¿Cuanto tarda en llegar el documento una vez solicitado?");
      expect(response.body[0].preguntas[2].slide).toBe(3);

      expect(response.body[0].respuestas.length).toBe(0);
      expect(response.body[0].icono).toBe("");
      expect(response.body[0].posicion).toBe(1);
      expect(response.body[0].pagina).toBe("documentos");
      expect(response.body[0].version).toBe(1);
      expect(response.body[0].habilitado).toBe(true);

      done();
    });
    it("Should get all seccion ayuda", async (done) => {
      const response = await request.get(`/v1/configuracion-hrapp/seccion-ayuda`);

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(5);
      expect(response.body[0].preguntas[0].texto).toBe("¿Como Solicito un documento?");
      expect(response.body[1].preguntas[0].texto).toBe("¿Como Solicito un documento?");
      expect(response.body[2].preguntas[0].texto).toBe("¿Cuantas veces puedo solicitar un documento?");
      expect(response.body[3].preguntas[0].texto).toBe("¿Cuanto tarda en llegar el documento una vez solicitado?");

      done();
    });
    it("Should get no seccion ayuda from empty database", async (done) => {
      await SeccionAyuda.deleteMany();
      const response = await request.get("/v1/configuracion-hrapp/seccion-ayuda");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);

      done();
    });
  });
});
