const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../api/app");
const mongoose = require("mongoose");
const { getMensajes } = require("../api/config");
const ConfigApiConfiguracion = require("../api/models/ConfigApiConfiguracion");
const configSeed = require("./testSeeds/configSeed.json");
const Unidades = require("../api/models/Unidades");
const unidadesSeed = require("./testSeeds/unidadesSeed.json");
const AuditLogging = require("../api/models/AuditLogging.js");

const request = supertest(app);

const secretoInterno = process.env.JWT_SECRET_INTERNO;

const user = {
  _id: "61832a43c8a4d50009607cab",
  userName: "admin",
  role: "admin",
};

const tokenInterno = jwt.sign(
  {
    user,
  },
  secretoInterno
);

const tokenInternoSinUsuario = jwt.sign(
  {
    user: {
      _id: "61832a43c8a4d50009607cab",
      userName: "admin",
      role: "",
    },
  },
  secretoInterno
);

const expectAuditLog = async (action) => {
  const registro = await AuditLogging.findOne({
    userName: user.userName,
    userId: user._id,
    action,
  }).exec();

  expect(registro).toBeTruthy();
  expect(registro.affectedData._id).toBeTruthy();
  expect(registro.createdAt).toBeTruthy();
};

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/unidades_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Unidades.create(unidadesSeed);
  await ConfigApiConfiguracion.create(configSeed);
});

afterEach(async () => {
  await Unidades.deleteMany();
  await ConfigApiConfiguracion.deleteMany();
  await AuditLogging.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints unidades", () => {
  describe("Get /v1/configuracion-hrapp/unidades", () => {
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
    it("Should get no unidades from empty database", async (done) => {
      await Unidades.deleteMany();
      const response = await request.get("/v1/configuracion-hrapp/unidades");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);

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
    it("Should get unidades por tipo without disabled unidades", async (done) => {
      const response = await request.get(
        `/v1/configuracion-hrapp/unidades?tipo=serviciosClinicos&incluirDeshabilitados=false`
      );

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(3);
      expect(response.body[0].nombre).toBe("Pediatría");
      expect(response.body[1].nombre).toBe("Unidad serviciosClinicos");
      expect(response.body[2].nombre).toBe("Laboratorio Clínico");

      done();
    });
    it("Should get unidades por tipo with disabled unidades", async (done) => {
      const response = await request.get(
        `/v1/configuracion-hrapp/unidades?tipo=serviciosClinicos&incluirDeshabilitados=true`
      );

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(4);
      expect(response.body[0].nombre).toBe("Pediatría");
      expect(response.body[1].nombre).toBe("Unidad serviciosClinicos");
      expect(response.body[2].nombre).toBe("Laboratorio Clínico");
      expect(response.body[3].nombre).toBe("Pediatría 2");

      done();
    });
  });
  describe("POST /v1/configuracion-hrapp/unidades", () => {
    it("Should not create unidad without token", async () => {
      const response = await request
        .post("/v1/configuracion-hrapp/unidades")
        .send({});

      const mensaje = await getMensajes("forbiddenAccess");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not create unidad with invalid token", async () => {
      const response = await request
        .post("/v1/configuracion-hrapp/unidades")
        .set("Authorization", "no-token")
        .send({});

      const mensaje = await getMensajes("forbiddenAccess");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not create unidad with invalid role", async () => {
      const response = await request
        .post("/v1/configuracion-hrapp/unidades")
        .set("Authorization", tokenInternoSinUsuario)
        .send({});

      const mensaje = await getMensajes("insufficientPermission");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not create unidad from empty data", async () => {
      await Unidades.deleteMany();
      const response = await request
        .post("/v1/configuracion-hrapp/unidades")
        .set("Authorization", tokenInterno)
        .send({});

      const mensaje = await getMensajes("badRequest");

      expect(response.status).toBe(400);
      expect(response.body.respuesta).toEqual({
        titulo: mensaje.titulo,
        mensaje: mensaje.mensaje,
        color: mensaje.color,
        icono: mensaje.icono,
      });
    });
    it("Should not create unidad with incomplete data", async () => {
      const response = await request
        .post("/v1/configuracion-hrapp/unidades")
        .set("Authorization", tokenInterno)
        .send({
          nombre: "",
          descripcion: "Servicios Clínicos",
          servicios: [
            "",
            "Cardiología Infantil",
            "Nutrición Infantil",
            "Cirugía y Ortopedía",
          ],
          atenciones: [
            {
              nombre: "",
              horario: {
                nota: "",
                atiendeFeriados: true,
                periodos: [
                  {
                    dias: {
                      inicio: "lunes",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
              contactos: {
                telefonos: ["", "552758966"],
                correos: ["correo@gmail.com", "correo2@gmail.com"],
              },
            },
            {
              nombre: "Encargado",
              horario: {
                nota: "Atención telefónica",
                periodos: [
                  {
                    dias: {
                      inicio: "",
                      fin: "",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
            },
          ],
          referencias: [
            {
              ubicacion: "1 piso",
              imagen: {
                src: "",
                alt: "imagen",
                srcset: [
                  "https://via.placeholder.com/30000x1500 2160w",
                  "https://via.placeholder.com/2000x1000 1080w",
                  "https://via.placeholder.com/1000x500 720w",
                  "https://via.placeholder.com/500x250 480w",
                ],
              },
            },
          ],
          tipo: "",
          posicion: 1,
        });

      const mensaje = await getMensajes("badRequest");

      expect(response.status).toBe(400);
      expect(response.body.respuesta).toEqual({
        titulo: mensaje.titulo,
        mensaje: mensaje.mensaje,
        color: mensaje.color,
        icono: mensaje.icono,
      });
    });
    it("Should not create unidad with invalid data", async () => {
      const response = await request
        .post("/v1/configuracion-hrapp/unidades")
        .set("Authorization", tokenInterno)
        .send({
          nombre: "####",
          descripcion: "Servicios Clínicos",
          servicios: [
            "####",
            "Cardiología Infantil",
            "Nutrición Infantil",
            "Cirugía y Ortopedía",
          ],
          atenciones: [
            {
              nombre: "#####",
              horario: {
                nota: "",
                atiendeFeriados: true,
                periodos: [
                  {
                    dias: {
                      inicio: "lunes#",
                      fin: "lunes",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
              contactos: {
                telefonos: ["###", "552758966"],
                correos: ["correo@gmail.com", "correo2@gmail.com"],
              },
            },
            {
              nombre: "Encargado",
              horario: {
                nota: "Atención telefónica",
                atenderFeriados: false,
                periodos: [
                  {
                    dias: {
                      inicio: "#",
                      fin: "#",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
            },
          ],
          referencias: [
            {
              ubicacion: "1 piso",
              imagen: {
                src: "###",
                alt: "imagen",
                srcset: [
                  "https://via.placeholder.com/30000x1500 2160w",
                  "httpsvia.placeholder.com/2000x1000 1080w",
                  "://via.placeholder.com/1000x500 720w",
                  "https://via.placeholder.com/500x250 480w",
                ],
              },
            },
          ],
          tipo: "serviciosClinicos",
          habilitado: true,
          posicion: 1,
        });

      const mensaje = await getMensajes("badRequest");

      expect(response.status).toBe(400);
      expect(response.body.respuesta).toEqual({
        titulo: mensaje.titulo,
        mensaje: mensaje.mensaje,
        color: mensaje.color,
        icono: mensaje.icono,
      });
    });
    it("Should not create unidad with same name", async () => {
      const response = await request
        .post("/v1/configuracion-hrapp/unidades")
        .set("Authorization", tokenInterno)
        .send({
          nombre: "Pediatría",
          descripcion: "Descripción",
          servicios: [
            "Servicio 1.",
            "Servicio 2.",
            "Servicio 3.",
            "Servicio 4.",
          ],
          atenciones: [
            {
              nombre: "Nombre Atención",
              horario: {
                nota: "Nota",
                atiendeFeriados: true,
                periodos: [
                  {
                    dias: {
                      inicio: "lunes",
                      fin: "lunes",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
              contactos: {
                telefonos: ["123123123", "552758966"],
                correos: ["correo@gmail.com", "correo2@gmail.com"],
              },
            },
            {
              nombre: "Encargado",
              horario: {
                nota: "Atención telefónica",
                atiendeFeriados: true,
                periodos: [
                  {
                    dias: {
                      inicio: "Viernes",
                      fin: "sábado",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
              contactos: {
                correos: ["correo@gmail.com", "correo2@gmail.com"],
              },
            },
          ],
          referencias: [
            {
              ubicacion: "1 piso",
            },
          ],
          tipo: "serviciosClinicos",
          habilitado: true,
          posicion: 5,
        });

      const mensaje = await getMensajes("badRequest");

      expect(response.status).toBe(400);
      expect(response.body.respuesta).toEqual({
        titulo: mensaje.titulo,
        mensaje: mensaje.mensaje,
        color: mensaje.color,
        icono: mensaje.icono,
      });
    });
    it("Should create unidad without image", async () => {
      const response = await request
        .post("/v1/configuracion-hrapp/unidades")
        .set("Authorization", tokenInterno)
        .send({
          nombre: "Nombre",
          descripcion: "Descripción",
          servicios: [
            "Servicio 1.",
            "Servicio 2.",
            "Servicio 3.",
            "Servicio 4.",
          ],
          atenciones: [
            {
              nombre: "Nombre Atención",
              horario: {
                nota: "Nota",
                atiendeFeriados: true,
                periodos: [
                  {
                    dias: {
                      inicio: "lunes",
                      fin: "lunes",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
              contactos: {
                telefonos: ["123123123", "552758966"],
                correos: ["correo@gmail.com", "correo2@gmail.com"],
              },
            },
            {
              nombre: "Encargado",
              horario: {
                nota: "Atención telefónica",
                atiendeFeriados: true,
                periodos: [
                  {
                    dias: {
                      inicio: "Viernes",
                      fin: "sábado",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
              contactos: {
                correos: ["correo@gmail.com", "correo2@gmail.com"],
              },
            },
          ],
          referencias: [
            {
              ubicacion: "1 piso",
            },
          ],
          tipo: "serviciosClinicos",
          habilitado: true,
          posicion: 5,
        });

      const mensaje = await getMensajes("created");

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });

      const unidad = await Unidades.findOne({ nombre: "Nombre" }).exec();

      expect(unidad.nombre).toBe("Nombre");
      expect(unidad.descripcion).toBe("Descripción");
      expect(unidad.servicios).toEqual([
        "Servicio 1.",
        "Servicio 2.",
        "Servicio 3.",
        "Servicio 4.",
      ]);
      expect(unidad.atenciones[0].nombre).toBe("Nombre Atención");
      expect(unidad.atenciones[0].horario.nota).toBe("Nota");
      expect(unidad.atenciones[0].horario.atiendeFeriados).toBe(true);
      expect(unidad.atenciones[0].horario.periodos[0].dias.inicio).toBe(
        "lunes"
      );
      expect(unidad.atenciones[0].horario.periodos[0].dias.fin).toBe("lunes");
      expect(unidad.atenciones[0].horario.periodos[0].horas[0].inicio).toBe(
        "08:00"
      );
      expect(unidad.atenciones[0].horario.periodos[0].horas[0].fin).toBe(
        "14:00"
      );
      expect(unidad.atenciones[0].contactos.telefonos).toEqual([
        "123123123",
        "552758966",
      ]);
      expect(unidad.atenciones[0].contactos.correos).toEqual([
        "correo@gmail.com",
        "correo2@gmail.com",
      ]);
      expect(unidad.atenciones[1].nombre).toBe("Encargado");
      expect(unidad.atenciones[1].horario.nota).toBe("Atención telefónica");
      expect(unidad.atenciones[1].horario.atiendeFeriados).toBe(true);
      expect(unidad.atenciones[1].horario.periodos[0].dias.inicio).toBe(
        "Viernes"
      );
      expect(unidad.atenciones[1].horario.periodos[0].dias.fin).toBe("sábado");
      expect(unidad.atenciones[1].horario.periodos[0].horas[0].inicio).toBe(
        "08:00"
      );
      expect(unidad.atenciones[1].horario.periodos[0].horas[0].fin).toBe(
        "14:00"
      );
      expect(unidad.atenciones[1].contactos.telefonos).toEqual([]);
      expect(unidad.atenciones[1].contactos.correos).toEqual([
        "correo@gmail.com",
        "correo2@gmail.com",
      ]);

      expect(unidad.referencias[0].ubicacion).toBe("1 piso");
      expect(unidad.tipo).toBe("serviciosClinicos");
      expect(unidad.habilitado).toBe(true);
      expect(unidad.posicion).toBe(5);
      expect(unidad.version).toBe(1);

      await expectAuditLog("POST /v1/configuracion-hrapp/unidades");
    });
  });
  describe("PUT /v1/configuracion-hrapp/unidades/:_id", () => {
    it("Should not update unidad without token", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cab")
        .send({});

      const mensaje = await getMensajes("forbiddenAccess");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not update unidad with invalid token", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cab")
        .set("Authorization", "no-token")
        .send({});

      const mensaje = await getMensajes("forbiddenAccess");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not update unidad with invalid role", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cab")
        .set("Authorization", tokenInternoSinUsuario)
        .send({});

      const mensaje = await getMensajes("insufficientPermission");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not update unidad if it does not exists", async () => {
      await Unidades.deleteMany();
      const response = await request
        .put("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cab")
        .set("Authorization", tokenInterno)
        .send({});

      const mensaje = await getMensajes("notFound");

      expect(response.status).toBe(404);
      expect(response.body.respuesta).toEqual({
        titulo: mensaje.titulo,
        mensaje: mensaje.mensaje,
        color: mensaje.color,
        icono: mensaje.icono,
      });
    });
    it("Should not update unidad with incomplete data", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cab")
        .set("Authorization", tokenInterno)
        .send({
          nombre: "",
          descripcion: "Descripción",
          servicios: ["Servicio 1.", "", "Servicio 3.", "Servicio 4."],
          atenciones: [
            {
              nombre: "Nombre Atención",
              horario: {
                nota: "Nota",
                periodos: [
                  {
                    dias: {
                      inicio: "lunes",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "",
                      },
                    ],
                  },
                ],
              },
              contactos: {
                telefonos: ["", "552758966"],
                correos: ["correo@gmail.com", "correo2@gmail.com"],
              },
            },
            {
              nombre: "",
              horario: {
                nota: "Atención telefónica",
                atiendeFeriados: true,
                periodos: [
                  {
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
            },
          ],
          referencias: [
            {
              _id: "67832a43c8a5d50009611cad",
              ubicacion: "1 piso",
              imagen: {
                alt: "imagen",
                srcset: [
                  "https://via.placeholder.com/30000x1500 2160w",
                  "https://via.placeholder.com/2000x1000 1080w",
                  "https://via.placeholder.com/1000x500 720w",
                  "https://via.placeholder.com/500x250 480w",
                ],
              },
            },
          ],
          habilitado: true,
          posicion: 1,
        });

      const mensaje = await getMensajes("badRequest");

      expect(response.status).toBe(400);
      expect(response.body.respuesta).toEqual({
        titulo: mensaje.titulo,
        mensaje: mensaje.mensaje,
        color: mensaje.color,
        icono: mensaje.icono,
      });
    });
    it("Should not update unidad from invalid data", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cab")
        .set("Authorization", tokenInterno)
        .send({
          nombre: "Nombre",
          descripcion: "Descripción",
          servicios: [
            "Servicio 1.",
            "Servicio 2.",
            "Servicio 3.",
            "Servicio 4.",
          ],
          atenciones: [
            {
              nombre: "Nombre Atención",
              horario: {
                nota: "Nota",
                atiendeFeriados: true,
                periodos: [
                  {
                    dias: {
                      inicio: "lunes",
                      fin: "lunes",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
              contactos: {
                telefonos: ["552758967", "552758966"],
                correos: ["correo@gmail.com", "correo2@gmail.com"],
              },
            },
            {
              nombre: "Encargado",
              horario: {
                nota: "Atenció#n telefónica",
                atiendeFeriados: true,
                periodos: [
                  {
                    dias: {
                      inicio: "Viernes",
                      fin: "sabado",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
            },
          ],
          referencias: [
            {
              _id: "67832a43c8a5d50009611cad",
              ubicacion: "1 piso",
              imagen: {
                src: "https://via.placeholder.com/500x250",
                srcset: [
                  "https://via.placeholder.com/30000x1500 2160w",
                  "https://via.placeholder.com/2000x1000 1080w",
                  "://via.placeholder.com/1000x500 720w",
                  "https://via.placeholder.com/500x250 480w",
                ],
              },
            },
          ],
          tipo: "serviciosClinicos",
          habilitado: true,
          posicion: 1,
        });

      const mensaje = await getMensajes("badRequest");

      expect(response.status).toBe(400);
      expect(response.body.respuesta).toEqual({
        titulo: mensaje.titulo,
        mensaje: mensaje.mensaje,
        color: mensaje.color,
        icono: mensaje.icono,
      });
    });
    it("Should not update unidad with same name", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cab")
        .set("Authorization", tokenInterno)
        .send({
          nombre: "Pediatría",
          descripcion: "Descripción",
          servicios: [
            "Servicio 1.",
            "Servicio 2.",
            "Servicio 3.",
            "Servicio 4.",
          ],
          atenciones: [
            {
              nombre: "Nombre Atención",
              horario: {
                nota: "Nota",
                atiendeFeriados: true,
                periodos: [
                  {
                    dias: {
                      inicio: "lunes",
                      fin: "lunes",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
              contactos: {
                telefonos: ["123123123", "552758966"],
                correos: ["correo@gmail.com", "correo2@gmail.com"],
              },
            },
            {
              nombre: "Encargado",
              horario: {
                nota: "Atención telefónica",
                atiendeFeriados: true,
                periodos: [
                  {
                    dias: {
                      inicio: "Viernes",
                      fin: "sábado",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
              contactos: {
                telefonos: ["123123123"],
              },
            },
          ],
          referencias: [
            {
              _id: "67832a43c8a5d50009611cad",
              ubicacion: "1 piso",
              imagen: {
                src: "https://via.placeholder.com/500x250",
                alt: "imagen",
                srcset: [
                  "https://via.placeholderr.com/30000x1500 2160w",
                  "https://via.placeholder.com/2000x1000 1080w",
                  "https://via.placeholder.com/1000x500 720w",
                  "https://via.placeholder.com/500x250 480w",
                ],
              },
            },
          ],
          tipo: "serviciosClinicos",
          habilitado: true,
          posicion: 6,
          _id: "id",
          __v: "v",
          version: "version",
        });

      const mensaje = await getMensajes("badRequest");

      expect(response.status).toBe(400);
      expect(response.body.respuesta).toEqual({
        titulo: mensaje.titulo,
        mensaje: mensaje.mensaje,
        color: mensaje.color,
        icono: mensaje.icono,
      });
    });
    it("Should update unidad without image", async () => {
      const response = await request
        .put("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cab")
        .set("Authorization", tokenInterno)
        .send({
          nombre: "Nombre",
          descripcion: "Descripción",
          servicios: [
            "Servicio 1.",
            "Servicio 2.",
            "Servicio 3.",
            "Servicio 4.",
          ],
          atenciones: [
            {
              nombre: "Nombre Atención",
              horario: {
                nota: "Nota",
                atiendeFeriados: true,
                periodos: [
                  {
                    dias: {
                      inicio: "lunes",
                      fin: "lunes",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
              contactos: {
                telefonos: ["123123123", "552758966"],
                correos: ["correo@gmail.com", "correo2@gmail.com"],
              },
            },
            {
              nombre: "Encargado",
              horario: {
                nota: "Atención telefónica",
                atiendeFeriados: true,
                periodos: [
                  {
                    dias: {
                      inicio: "Viernes",
                      fin: "sábado",
                    },
                    horas: [
                      {
                        inicio: "08:00",
                        fin: "14:00",
                      },
                    ],
                  },
                ],
              },
              contactos: {
                telefonos: ["123123123"],
              },
            },
          ],
          referencias: [
            {
              _id: "67832a43c8a5d50009611cad",
              ubicacion: "1 piso",
              imagen: {
                src: "https://via.placeholder.com/500x250",
                alt: "imagen",
                srcset: [
                  "https://via.placeholderr.com/30000x1500 2160w",
                  "https://via.placeholder.com/2000x1000 1080w",
                  "https://via.placeholder.com/1000x500 720w",
                  "https://via.placeholder.com/500x250 480w",
                ],
              },
            },
          ],
          tipo: "serviciosClinicos",
          habilitado: true,
          posicion: 6,
          _id: "id",
          __v: "v",
          version: "version",
        });

      const mensaje = await getMensajes("success");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });

      const unidad = await Unidades.findOne({
        _id: "67832a43c8a5d50009611cab",
      }).exec();

      expect(unidad.nombre).toBe("Nombre");
      expect(unidad.descripcion).toBe("Descripción");
      expect(unidad.servicios).toEqual([
        "Servicio 1.",
        "Servicio 2.",
        "Servicio 3.",
        "Servicio 4.",
      ]);
      expect(unidad.atenciones[0].nombre).toBe("Nombre Atención");
      expect(unidad.atenciones[0].horario.nota).toBe("Nota");
      expect(unidad.atenciones[0].horario.atiendeFeriados).toBe(true);
      expect(unidad.atenciones[0].horario.periodos[0].dias.inicio).toBe(
        "lunes"
      );
      expect(unidad.atenciones[0].horario.periodos[0].dias.fin).toBe("lunes");
      expect(unidad.atenciones[0].horario.periodos[0].horas[0].inicio).toBe(
        "08:00"
      );
      expect(unidad.atenciones[0].horario.periodos[0].horas[0].fin).toBe(
        "14:00"
      );
      expect(unidad.atenciones[0].contactos.telefonos).toEqual([
        "123123123",
        "552758966",
      ]);
      expect(unidad.atenciones[0].contactos.correos).toEqual([
        "correo@gmail.com",
        "correo2@gmail.com",
      ]);
      expect(unidad.atenciones[1].nombre).toBe("Encargado");
      expect(unidad.atenciones[1].horario.nota).toBe("Atención telefónica");
      expect(unidad.atenciones[1].horario.atiendeFeriados).toBe(true);
      expect(unidad.atenciones[1].horario.periodos[0].dias.inicio).toBe(
        "Viernes"
      );
      expect(unidad.atenciones[1].horario.periodos[0].dias.fin).toBe("sábado");
      expect(unidad.atenciones[1].horario.periodos[0].horas[0].inicio).toBe(
        "08:00"
      );
      expect(unidad.atenciones[1].horario.periodos[0].horas[0].fin).toBe(
        "14:00"
      );
      expect(unidad.atenciones[1].contactos.telefonos).toEqual(["123123123"]);
      expect(unidad.atenciones[1].contactos.correos).toEqual([]);
      expect(unidad.referencias[0].ubicacion).toBe("1 piso");
      expect(unidad.referencias[0].imagen.src).toBe(
        "https://via.placeholder.com/1000x500"
      );
      expect(unidad.referencias[0].imagen.alt).toBe("imagen");
      expect(unidad.referencias[0].imagen.srcset).toEqual([
        "https://via.placeholder.com/30000x1500 2160w",
        "https://via.placeholder.com/2000x1000 1080w",
        "https://via.placeholder.com/1000x500 720w",
        "https://via.placeholder.com/500x250 480w",
      ]);
      expect(unidad.tipo).toBe("serviciosClinicos");
      expect(unidad.habilitado).toBe(true);
      expect(unidad.posicion).toBe(6);
      expect(unidad.version).toBe(1);

      await expectAuditLog("PUT /v1/configuracion-hrapp/unidades/:_id");
    });
  });
  describe("DELETE /v1/configuracion-hrapp/unidades", () => {
    it("Should not delete unidad without token", async () => {
      const response = await request
        .delete("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cab")
        .send({});

      const mensaje = await getMensajes("forbiddenAccess");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not delete unidad with invalid token", async () => {
      const response = await request
        .delete("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cab")
        .set("Authorization", "no-token")
        .send({});

      const mensaje = await getMensajes("forbiddenAccess");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not delete unidad with invalid role", async () => {
      const response = await request
        .delete("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cab")
        .set("Authorization", tokenInternoSinUsuario)
        .send({});

      const mensaje = await getMensajes("insufficientPermission");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not delete unidad if it does not exists", async () => {
      await Unidades.deleteMany();
      const response = await request
        .delete("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cab")
        .set("Authorization", tokenInterno)
        .send({});

      const mensaje = await getMensajes("notFound");

      expect(response.status).toBe(404);
      expect(response.body.respuesta).toEqual({
        titulo: mensaje.titulo,
        mensaje: mensaje.mensaje,
        color: mensaje.color,
        icono: mensaje.icono,
      });
    });
    // it("Should delete unidad", async () => {
    //   const response = await request
    //     .delete("/v1/configuracion-hrapp/unidades/67832a43c8a5d50009611cad")
    //     .set("Authorization", tokenInterno);

    //   const mensaje = await getMensajes("success");

    //   expect(response.status).toBe(200);
    //   expect(response.body).toEqual({
    //     respuesta: {
    //       titulo: mensaje.titulo,
    //       mensaje: mensaje.mensaje,
    //       color: mensaje.color,
    //       icono: mensaje.icono,
    //     },
    //   });

    //   const unidad = await Unidades.findOne({
    //     _id: "67832a43c8a5d50009611cad",
    //   }).exec();

    //   expect(unidad).toBeFalsy();
    // });
  });
});
