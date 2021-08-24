const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const ConfiguracionHRApp = require("../models/ConfiguracionHRApp");
const configuracionHRAppSeed = require("../testSeeds/configuracionHRAppSeed.json");

const request = supertest(app);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}configuracion_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await ConfiguracionHRApp.create(configuracionHRAppSeed);
});

afterEach(async () => {
  await ConfiguracionHRApp.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints menus", () => {
  describe("Get configuracion de la HRApp", () => {
    it("Should get configuracion de la HRApp from database", async (done) => {
      const response = await request.get("/v1/configuracion-hrapp");

      expect(response.status).toBe(200);

      expect(response.body).toBeTruthy();
      // funcionalidadesHabilitadas
      expect(
        response.body.funcionalidadesHabilitadas.horasMedicas.solicitudAnular
      ).toBe(true);
      expect(
        response.body.funcionalidadesHabilitadas.horasMedicas.solicitudCambiar
      ).toBe(true);
      expect(
        response.body.funcionalidadesHabilitadas.horasExamenes.solicitudAnular
      ).toBe(false);
      expect(
        response.body.funcionalidadesHabilitadas.horasExamenes.solicitudCambiar
      ).toBe(false);
      // parametrosEndpoints
      expect(
        response.body.parametrosEndpoints.documentosPacientes.cantidadAObtener
      ).toBe(5);
      // textosApp
      expect(response.body.textosApp.nombreApp).toBe("Hospital En Tus Manos");
      expect(response.body.textosApp.mensajeBienvenida).toBe("Bienvenido");
      // textosApp tituloPaginas
      expect(Object.keys(response.body.textosApp.tituloPaginas).length).toBe(
        13
      );
      // textosApp alertas
      expect(Object.keys(response.body.textosApp.alertas).length).toBe(17);
      // textosApp componentes
      expect(Object.keys(response.body.textosApp.componentes).length).toBe(13);
      expect(
        Object.keys(response.body.textosApp.componentes.citaPaciente).length
      ).toBe(9);
      expect(
        Object.keys(response.body.textosApp.componentes.citasPacienteHistorico)
          .length
      ).toBe(1);
      expect(
        Object.keys(response.body.textosApp.componentes.citasPacienteHoy).length
      ).toBe(1);
      expect(
        Object.keys(response.body.textosApp.componentes.citasPacienteProximas)
          .length
      ).toBe(1);
      expect(
        Object.keys(response.body.textosApp.componentes.datosContactoSolicitud)
          .length
      ).toBe(9);
      expect(
        Object.keys(response.body.textosApp.componentes.datosMedicoSolicitud)
          .length
      ).toBe(8);
      expect(
        Object.keys(response.body.textosApp.componentes.datosPaciente).length
      ).toBe(25);
      expect(
        Object.keys(response.body.textosApp.componentes.detalleUnidad).length
      ).toBe(11);
      expect(
        Object.keys(response.body.textosApp.componentes.documento).length
      ).toBe(1);
      expect(
        Object.keys(response.body.textosApp.componentes.informacionReceta)
          .length
      ).toBe(4);
      expect(
        Object.keys(response.body.textosApp.componentes.listaDocumentos).length
      ).toBe(1);
      expect(
        Object.keys(response.body.textosApp.componentes.medicamentosReceta)
          .length
      ).toBe(1);
      expect(
        Object.keys(response.body.textosApp.componentes.pasesReceta).length
      ).toBe(2);
      // textosApp paginas
      expect(Object.keys(response.body.textosApp.paginas).length).toBe(12);
      expect(
        Object.keys(response.body.textosApp.paginas.historicoHorasExamenes)
          .length
      ).toBe(2);
      expect(
        Object.keys(response.body.textosApp.paginas.historicoHorasMedicas)
          .length
      ).toBe(2);
      expect(
        Object.keys(response.body.textosApp.paginas.horasExamenes).length
      ).toBe(4);
      expect(
        Object.keys(response.body.textosApp.paginas.horasMedicas).length
      ).toBe(4);
      expect(Object.keys(response.body.textosApp.paginas.inicio).length).toBe(
        1
      );
      expect(Object.keys(response.body.textosApp.paginas.menuDocumentos).length).toBe(
        1
      );
      expect(
        Object.keys(response.body.textosApp.paginas.misionVision).length
      ).toBe(1);
      expect(Object.keys(response.body.textosApp.paginas.recetas).length).toBe(
        2
      );
      expect(
        Object.keys(response.body.textosApp.paginas.solicitudCita).length
      ).toBe(7);
      expect(
        Object.keys(response.body.textosApp.paginas.solicitudDocumentos).length
      ).toBe(3);
      expect(Object.keys(response.body.textosApp.paginas.unidades).length).toBe(
        1
      );
      expect(
        Object.keys(response.body.textosApp.paginas.versionDeprecada).length
      ).toBe(1);

      expect(response.body.imagenesApp.inicio.src).toBe(
        "https://via.placeholder.com/1000x500"
      );
      expect(response.body.imagenesApp.inicio.srcset.length).toBe(4);
      expect(response.body.imagenesApp.inicio.srcset[0]).toBe(
        "https://via.placeholder.com/3000x1500 2160w"
      );
      expect(response.body.imagenesApp.inicio.srcset[1]).toBe(
        "https://via.placeholder.com/2000x1000 1080w"
      );
      expect(response.body.imagenesApp.inicio.srcset[2]).toBe(
        "https://via.placeholder.com/1000x500 720w"
      );
      expect(response.body.imagenesApp.inicio.srcset[3]).toBe(
        "https://via.placeholder.com/500x250 480w"
      );
      expect(response.body.imagenesApp.inicio.alt).toBe("imagenes");
      expect(response.body.imagenesApp.informacionGeneral).toBeTruthy();
      expect(response.body.imagenesApp.serviciosPaciente).toBeTruthy();
      expect(response.body.imagenesApp.misionVision).toBeTruthy();
      expect(response.body.imagenesApp.menuPrestaciones).toBeTruthy();

      done();
    });
  });
});
