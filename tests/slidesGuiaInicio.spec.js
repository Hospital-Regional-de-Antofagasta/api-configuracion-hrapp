const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const SlidesGuiaInicio = require("../api/models/SlidesGuiaInicio");
const slidesGuiaInicioSeed = require("./testSeeds/slidesGuiaInicioSeed.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/config_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await SlidesGuiaInicio.create(slidesGuiaInicioSeed);
});

afterEach(async () => {
  await SlidesGuiaInicio.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints slides guia inicio", () => {
  describe("Get slides guia inicio", () => {
    it("Should get slides guia inicio", async (done) => {
      const response = await request.get(`/v1/configuracion-hrapp/slides-guia-inicio`);

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(3);
      expect(response.body[0].titulo.texto).toBe("¡Bienvenido!");
      expect(response.body[1].titulo.texto).toBe("Informaciones");
      expect(response.body[2].titulo.texto).toBe("");

      expect(response.body[0].titulo.texto).toBe("¡Bienvenido!");
      expect(response.body[0].titulo.color).toBe("primary");
      expect(response.body[0].titulo.tamanio).toBe("larger");
      expect(response.body[0].titulo.alineamiento).toBe("center");
      expect(response.body[0].titulo.bold).toBe(true);

      expect(response.body[0].imagen.src).toBe("https://via.placeholder.com/500x500");
      expect(response.body[0].imagen.srcset[0]).toBe("https://via.placeholder.com/1500x1500 2160w");
      expect(response.body[0].imagen.srcset[1]).toBe("https://via.placeholder.com/1000x1000 1080w");
      expect(response.body[0].imagen.srcset[2]).toBe("https://via.placeholder.com/500x500 720w");
      expect(response.body[0].imagen.srcset[3]).toBe("https://via.placeholder.com/250x250 480w");
      expect(response.body[0].imagen.alt).toBe("imagen");

      expect(response.body[0].icono.icono).toBe("");
      expect(response.body[0].icono.color).toBe("tertiary");

      expect(response.body[0].subtitulo.texto).toBe("Ingresa y obten acceso a");
      expect(response.body[0].subtitulo.color).toBe("primary");
      expect(response.body[0].subtitulo.tamanio).toBe("large");
      expect(response.body[0].subtitulo.alineamiento).toBe("center");
      expect(response.body[0].subtitulo.bold).toBe(true);

      expect(response.body[0].contenido.texto.texto).toBe("");
      expect(response.body[0].contenido.texto.color).toBe("secondary");
      expect(response.body[0].contenido.texto.tamanio).toBe("medium");
      expect(response.body[0].contenido.texto.alineamiento).toBe("start");
      expect(response.body[0].contenido.texto.bold).toBe(true);

      expect(response.body[0].contenido.lista[0].icono.icono).toBe("briefcase-medical");
      expect(response.body[0].contenido.lista[0].icono.color).toBe("secondary");
      expect(response.body[0].contenido.lista[0].icono.tamanio).toBe("x-large");
      expect(response.body[0].contenido.lista[0].icono.alineamiento).toBe("center");

      expect(response.body[0].contenido.lista[0].texto.texto).toBe("Tu información hospitalaria");
      expect(response.body[0].contenido.lista[0].texto.color).toBe("dark");
      expect(response.body[0].contenido.lista[0].texto.tamanio).toBe("small");
      expect(response.body[0].contenido.lista[0].texto.alineamiento).toBe("start");
      expect(response.body[0].contenido.lista[0].texto.bold).toBe(true);

      expect(response.body[0].contenido.lista[1].icono.icono).toBe("hospital");
      expect(response.body[0].contenido.lista[1].icono.color).toBe("secondary");
      expect(response.body[0].contenido.lista[1].icono.tamanio).toBe("x-large");
      expect(response.body[0].contenido.lista[1].icono.alineamiento).toBe("center");

      expect(response.body[0].contenido.lista[1].texto.texto).toBe("Información útil sobre el hospital");
      expect(response.body[0].contenido.lista[1].texto.color).toBe("dark");
      expect(response.body[0].contenido.lista[1].texto.tamanio).toBe("small");
      expect(response.body[0].contenido.lista[1].texto.alineamiento).toBe("start");
      expect(response.body[0].contenido.lista[1].texto.bold).toBe(true);

      expect(response.body[0].boton.texto).toBe("");
      expect(response.body[0].boton.icono).toBe("arrow-right");
      expect(response.body[0].boton.color).toBe("medium");
      expect(response.body[0].boton.tamanio).toBe("small");
      expect(response.body[0].boton.alineamiento).toBe("center");
      expect(response.body[0].boton.bold).toBe(false);

      expect(response.body[0].animacion).toBe(true);

      expect(response.body[0].habilitado).toBe(true);

      expect(response.body[0].posicion).toBe(1);

      expect(response.body[0].version).toBe(1);

      done();
    });
    it("Should get no slides guia de inicio from empty database", async (done) => {
      await SlidesGuiaInicio.deleteMany();
      const response = await request.get("/v1/configuracion-hrapp/slides-guia-inicio");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);

      done();
    });
  });
});
