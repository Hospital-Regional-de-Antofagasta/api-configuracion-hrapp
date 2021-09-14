const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../api/app");
const Versiones = require("../api/models/Versiones");
const versionesSeed = require("./testSeeds/versionesSeed.json");
const { getMensajes } = require("../api/config");
const ConfigApiConfiguracion = require("../api/models/ConfigApiConfiguracion");
const configSeed = require("./testSeeds/configSeed.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(
    `${process.env.MONGO_URI}/config_test`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  await Versiones.create(versionesSeed);
  await ConfigApiConfiguracion.create(configSeed);
});

afterEach(async () => {
  await Versiones.deleteMany();
  await ConfigApiConfiguracion.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoint manage old versions", () => {
  describe("Check version state", () => {
    it("Should return message for non existing version", async () => {
      const response = await request
        .post("/v1/configuracion-hrapp/version/revisar-si-version-deprecada/")
        .send({
          appName: "Hospital En Tus Manos",
          appVersion: "10.1.0",
          appBuildNumber: "7",
          platform: "Android",
          platformVersion: "10",
        });

      const mensaje = await getMensajes("versionNotFound");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        estado: "NO_ENCONTRADA",
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should return message for deprecated version", async () => {
      const response = await request
        .post("/v1/configuracion-hrapp/version/revisar-si-version-deprecada/")
        .send({
          appName: "Hospital En Tus Manos",
          appVersion: "1.0.7",
          appBuildNumber: "7",
          platform: "Android",
          platformVersion: "10",
        });

      const mensaje = await getMensajes("deprecatedVersion");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        estado: "DEPRECADA",
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should return message for version that requires update", async () => {
      const response = await request
        .post("/v1/configuracion-hrapp/version/revisar-si-version-deprecada/")
        .send({
          appName: "Hospital En Tus Manos",
          appVersion: "1.1.0",
          appBuildNumber: "7",
          platform: "Android",
          platformVersion: "10",
        });

      const mensaje = await getMensajes("remindUpdate");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        estado: "RECORDAR_ACTUALIZACION",
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should return nothing if version is ok", async () => {
      const response = await request
        .post("/v1/configuracion-hrapp/version/revisar-si-version-deprecada/")
        .send({
          appName: "Hospital En Tus Manos",
          appVersion: "1.1.3",
          appBuildNumber: "7",
          platform: "Android",
          platformVersion: "10",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ estado: "OK" });
    });
  });
});
