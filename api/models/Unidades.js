const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MenuUnidades = require("./MenuUnidades");
const { regex } = require("../utils/regexValidaciones");

const diasDeLaSemana = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

const validarMinimo1 = (valor) => {
  if (!valor) return false;
  if (valor.length === 0) return false;
  return true;
};

const validarDiaInicioMayorADiaFin = (dias) => {
  const { inicio, fin } = dias;

  const indexInicio = diasDeLaSemana.indexOf(inicio?.toLowerCase());
  const indexFin = diasDeLaSemana.indexOf(fin?.toLowerCase());

  if (indexInicio) return true;
  if (indexFin) return true;
  if (indexInicio > indexFin) return false;
  return true;
};

const validarHorasInicioMayorAHoraFin = (horas) => {
  for (let hora of horas) {
    const { inicio, fin } = hora;

    if (!inicio) continue;
    if (!fin) continue;

    const arregloInicio = inicio.split(":");
    const horasInicio = parseInt(arregloInicio[0]);
    const minutosInicio = parseInt(arregloInicio[1]);

    const arregloFin = fin.split(":");
    const horasFin = parseInt(arregloFin[0]);
    const minutosFin = parseInt(arregloFin[1]);

    if (horasInicio >= horasFin) {
      if (minutosInicio > minutosFin) return false;
    }
  }
  return true;
};

const validarMinimoUnContacto = (contactos) => {
  const { telefonos, correos } = contactos;
  for (let telefono of telefonos) {
    if (telefono) return true;
  }
  for (let correo of correos) {
    if (correo) return true;
  }
  return false;
};

const validarNombreAtencion = (atenciones) => {
  if (atenciones.length > 1) {
    for (let atencion of atenciones) {
      if (!atencion.nombre) return false;
    }
  }
  return true;
};

const validarIngresarAlt = (alt) => {
  if (!alt) return false;
  return true;
};

const Unidades = mongoose.model(
  "unidades",
  new Schema({
    nombre: {
      type: String,
      trim: true,
      required: [true, "El nombre es obligatorio."],
      unique: true,
      match: [
        regex.nombre,
        "El nombre '{VALUE}' no tiene el formato correcto.",
      ],
      maxLength: [50, "El nombre no puede superar los 50 caracteres."],
      minLength: [1, "El nombre es obligatorio."],
    },
    descripcion: {
      type: String,
      trim: true,
      required: [true, "La descripción es obligatoria."],
      match: [
        regex.texto,
        "La descripción ingresada no tiene el formato correcto.",
      ],
      maxLength: [500, "La descripción no puede superar los 500 caracteres."],
      minLength: [1, "La descripción es obligatoria."],
    },
    servicios: {
      type: [
        {
          type: String,
          trim: true,
          required: [true, "El servicio es obligatorio."],
          match: [
            regex.nombre,
            "El servicio '{VALUE}' no tiene el formato correcto.",
          ],
          maxLength: [50, "El servicio no puede superar los 50 caracteres."],
          minLength: [1, "La descripción es obligatoria."],
        },
      ],
      validate: {
        validator: validarMinimo1,
        message: "Se debe ingresar al menos un servicio.",
      },
    },
    atenciones: {
      type: [
        {
          nombre: {
            type: String,
            trim: true,
            match: [
              regex.nombre,
              "El nombre de la atención '{VALUE}' no tiene el formato correcto.",
            ],
            maxLength: [
              50,
              "El nombre de la atención no puede superar los 50 caracteres.",
            ],
            minLength: [1, "El nombre de la atención no puede ser vacío."],
          },
          horario: {
            type: {
              nota: {
                type: String,
                trim: true,
                match: [
                  regex.texto,
                  "La nota '{VALUE}' no tiene el formato correcto.",
                ],
                maxLength: [50, "La nota no puede superar los 50 caracteres."],
              },
              atiendeFeriados: {
                type: Boolean,
                required: [true, "El atiendeFeriados es obligatorio."],
              },
              periodos: {
                type: [
                  {
                    dias: {
                      type: {
                        inicio: {
                          type: String,
                          trim: true,
                          required: [
                            true,
                            "El día de inicio del periodo es obligatorio.",
                          ],
                          match: [
                            regex.dias,
                            "El día de inicio del periodo '{VALUE}' no tiene el formato correcto.",
                          ],
                        },
                        fin: {
                          type: String,
                          trim: true,
                          required: [
                            true,
                            "El día de fin del periodo es obligatorio.",
                          ],
                          match: [
                            regex.dias,
                            "El día de fin del periodo '{VALUE}' no tiene el formato correcto.",
                          ],
                        },
                      },
                      required: [
                        true,
                        "Los días del periodo son obligatorios.",
                      ],
                      validate: [
                        {
                          validator: validarDiaInicioMayorADiaFin,
                          message:
                            "El día de fin del periodo debe ser posterior o igual al día de inicio",
                        },
                      ],
                    },
                    horas: {
                      type: [
                        {
                          inicio: {
                            type: String,
                            trim: true,
                            required: [
                              true,
                              "La hora de inicio del periodo es obligatoria.",
                            ],
                            match: [
                              regex.hora,
                              "La hora de inicio del periodo '{VALUE}' no tiene el formato correcto.",
                            ],
                          },
                          fin: {
                            type: String,
                            trim: true,
                            required: [
                              true,
                              "La hora de fin del periodo es obligatoria.",
                            ],
                            match: [
                              regex.hora,
                              "La hora de fin del periodo '{VALUE}' no tiene el formato correcto.",
                            ],
                          },
                        },
                      ],
                      validate: [
                        {
                          validator: validarMinimo1,
                          message:
                            "Se debe ingresar al menos un rango de horas del periodo.",
                        },
                        {
                          validator: validarHorasInicioMayorAHoraFin,
                          message:
                            "La hora de fin del periodo debe ser posterior o igual a la hora de inicio",
                        },
                      ],
                    },
                  },
                ],
                validate: [
                  {
                    validator: validarMinimo1,
                    message: "Se debe ingresar al menos un periodo.",
                  },
                ],
              },
            },
            required: [true, "El horario es obligatorio."],
          },
          contactos: {
            type: {
              telefonos: {
                type: [
                  {
                    type: String,
                    trim: true,
                    match: [
                      regex.telefonoFijoMovil,
                      "El télfono '{VALUE}' no tiene el formato correcto.",
                    ],
                  },
                ],
              },
              correos: {
                type: [
                  {
                    type: String,
                    trim: true,
                    match: [
                      regex.correo,
                      "El correo '{VALUE}' no tiene el formato correcto.",
                    ],
                    maxLength: [
                      320,
                      "El correo no puede superar los 320 caracteres.",
                    ],
                  },
                ],
              },
            },
            required: [true, "Se debe ingresar al menos un contacto."],
            validate: [
              {
                validator: validarMinimoUnContacto,
                message: "Se debe ingresar al menos un contacto.",
              },
            ],
          },
        },
      ],
      validate: [
        {
          validator: validarMinimo1,
          message: "Se debe ingresar al menos una atención.",
        },
        {
          validator: validarNombreAtencion,
          message:
            "El nombre de la atención es obligatorio si existe mas de una atención.",
        },
      ],
    },
    referencias: {
      type: [
        {
          ubicacion: {
            type: String,
            trim: true,
            required: [true, "La ubicación es obligatoria."],
            match: [
              regex.texto,
              "La ubicación ingresada no tiene el formato correcto.",
            ],
            maxLength: [
              150,
              "La ubicación no puede superar los 150 caracteres.",
            ],
            minLength: [1, "La ubicación es obligatoria."],
          },
          imagen: {
            src: { type: String, trim: true },
            alt: {
              type: String,
              trim: true,
              match: [
                regex.texto,
                "El alt ingresado no tiene el formato correcto.",
              ],
              maxLength: [50, "El alt no puede superar los 50 caracteres."],
              minLength: [1, "El alt no puede ser vacío."],
              validate: [
                {
                  validator: validarIngresarAlt,
                  message: "El alt es obligatorio.",
                },
              ],
            },
            srcset: [{ type: String, trim: true }],
            carpeta: { type: String, trim: true },
          },
        },
      ],
      validate: [
        {
          validator: validarMinimo1,
          message: "Se debe ingresar al menos una referencia.",
        },
      ],
    },
    tipo: {
      type: String,
      required: [true, "El tipo es obligatorio."],
      match: [regex.nombre, "El tipo ingresado no tiene el formato correcto."],
      maxLength: [50, "El tipo no puede superar los 50 caracteres."],
      minLength: [1, "El tipo es obligatorio."],
    },
    // idMenu: {
    //   type: Schema.Types.ObjectId,
    //   ref: "menu_unidades",
    //   required: [true, "El idMenu es obligatorio."],
    //   validate: [
    //     {
    //       validator: validarExisteItemMenuUnidad,
    //       message: "El item del menu debe existir.",
    //     },
    //   ],
    // },
    habilitado: {
      type: Boolean,
      required: [true, "El habilitado es obligatorio."],
    },
    posicion: {
      type: Number,
      required: [true, "La posición es obligatoria."],
      max: [99, "La posición no puede ser mayor a 99"],
      min: [1, "La posición no puede ser menor a 0"],
    },
    version: Number,
  }),
  "unidades"
);

module.exports = Unidades;
