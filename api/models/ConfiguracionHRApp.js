const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfiguracionHRApp = mongoose.model(
  "configuracion_hrapp",
  new Schema({
    funcionalidadesHabilitadas: {
      horasMedicas: {
        solicitudAnular: Boolean,
        solicitudCambiar: Boolean,
      },
      horasExamenes: {
        solicitudAnular: Boolean,
        solicitudCambiar: Boolean,
      },
    },
    parametrosEndpoints: {
      documentosPacientes: {
        cantidadAObtener: Number,
      },
    },
    parametrosApp: {
      cantidadVisitasParaReview: Number,
    },
    textosApp: {
      nombreApp: String,
      mensajeBienvenida: String,
      tituloPaginas: {
        informacionGeneral: String,
        menuPrestaciones: String,
        misionVision: String,
        serviciosPaciente: String,
        recetas: String,
        horasMedicas: String,
        historicoHorasMedicas: String,
        solicitudCita: String,
        actualizarDatosPaciente: String,
        horasExamenes: String,
        historicoHorasExamenes: String,
        menuDocumentos: String,
        solicitudDocumentos: String,
      },
      alertas: {
        fueraDePlazoCambiar: {
          titulo: String,
          mensaje: String,
        },
        fueraDePlazoAnular: {
          titulo: String,
          mensaje: String,
        },
        consultarActualizacionPendiente: {
          titulo: String,
          mensaje: String,
        },
        alertasCamposNoValidosNumeroOculto: {
          titulo: String,
          mensaje: String,
        },
        alertasCamposNoValidosPoblacionOculto: {
          titulo: String,
          mensaje: String,
        },
        alertasCamposNoValidosCalleOculto: {
          titulo: String,
          mensaje: String,
        },
        alertasCamposNoValidosDepartamentoOculto: {
          titulo: String,
          mensaje: String,
        },
        alertasCamposNoValidosCorreoOculto: {
          titulo: String,
          mensaje: String,
        },
        alertasCamposNoValidosFonoOculto: {
          titulo: String,
          mensaje: String,
        },
        alertasCamposNoValidosCeluOculto: {
          titulo: String,
          mensaje: String,
        },
        alertasCamposNoValidosTelefonoMovilFijo: {
          titulo: String,
          mensaje: String,
        },
        alertasCamposNoValidosRegionOculto: {
          titulo: String,
          mensaje: String,
        },
        alertasCamposNoValidosComunaOculto: {
          titulo: String,
          mensaje: String,
        },
        inicioSesion: {
          titulo: String,
          mensaje: String,
        },
        actualizacionDatosPacienteEnCurso: {
          titulo: String,
          mensaje: String,
        },
        errorInesperado: {
          titulo: String,
          mensaje: String,
        },
        redirectConSesionEInternet: {
          titulo: String,
          mensaje: String,
        },
      },
      componentes: {
        citaPaciente: {
          dr: String,
          hora: String,
          hrs: String,
          lugar: String,
          fecha: String,
          zonaHoraria: String,
          alta: String,
          btnCambioHora: String,
          btnAnularHora: String,
        },
        citasPacienteHistorico: {
          noHayDatos: String,
        },
        citasPacienteHoy: {
          noHayDatos: String,
        },
        citasPacienteProximas: {
          noHayDatos: String,
        },
        datosContactoSolicitud: {
          datosContacto: String,
          bdgActualizacionEnCurso: String,
          telefono: String,
          celular: String,
          correo: String,
          arroba: String,
          mensajeRelevante: String,
          espera: String,
          btnActualizar: String,
        },
        datosMedicoSolicitud: {
          informacionHoraMedica: String,
          especialista: String,
          servicio: String,
          lugar: String,
          fecha: String,
          hora: String,
          hrs: String,
          cargando: String,
        },
        datosPaciente: {
          bdgActualizacionDatosCurso: String,
          localidad: String,
          region: String,
          campoObligatorio: String,
          comuna: String,
          direccion: String,
          poblacion: String,
          poblacionNoValida: String,
          caracteresPermitidos: String,
          calleNoValida: String,
          numero: String,
          numeroNoValido: String,
          detalleDireccion: String,
          departamentoNoValido: String,
          contacto: String,
          telefono: String,
          telefonoNoValido: String,
          celular: String,
          celularPrimerosDigitos: String,
          celularNoValido: String,
          minimoUnNumeroContacto: String,
          correo: String,
          correoValido: String,
          btnActualizar: String,
          btnConfirmar: String,
        },
        detalleUnidad: {
          noHayDatos: String,
          descripcion: String,
          servicios: String,
          enumerador: String,
          horarioAtencion: String,
          separadorDias: String,
          separadorHoras: String,
          contacto: String,
          fono: String,
          correo: String,
          referrencia: String,
        },
        documento: {
          btnSolicitar: String,
        },
        informacionReceta: {
          numeroReceta: String,
          dr: String,
          paseActual: String,
          fechaRetiro: String,
        },
        listaDocumentos: {
          noHayDatos: String,
        },
        medicamentosReceta: {
          medicamentos: String,
        },
        pasesReceta: {
          pases: String,
          numeroPase: String,
        },
      },
      paginas: {
        historicoHorasExamenes: {
          tituloSeccion: String,
          cargando: String,
        },
        historicoHorasMedicas: {
          tituloSeccion: String,
          cargando: String,
        },
        horasExamenes: {
          seccionHoy: String,
          historico: String,
          seccionProximas: String,
          cargando: String,
        },
        horasMedicas: {
          seccionHoy: String,
          historico: String,
          seccionProximas: String,
          cargando: String,
        },
        inicio: {
          cargando: String,
        },
        menuDocumentos: {
          cargando: String,
        },
        misionVision: {
          cargando: String,
        },
        recetas: {
          noHayDatos: String,
          cargando: String,
        },
        solicitudCita: {
          motivo: String,
          campoObligatorio: String,
          detalle: String,
          campoObligatorioOtro: String,
          validacionDetalle: String,
          caracteresValidosDetalles: String,
          btnEnviar: String,
        },
        solicitudDocumentos: {
          titulo: String,
          tituloSeccion: String,
          btnSolicitar: String,
        },
        unidades: {
          noHayDatos: String,
        },
        versionDeprecada: {
          btnActualizar: String,
        },
      },
    },
    imagenesApp: {
      inicio: {
        src: String,
        srcset: [String],
        alt: String,
      },
      informacionGeneral: {
        src: String,
        srcset: [String],
        alt: String,
      },
      serviciosPaciente: {
        src: String,
        srcset: [String],
        alt: String,
      },
      misionVision: {
        src: String,
        srcset: [String],
        alt: String,
      },
      menuPrestaciones: {
        src: String,
        srcset: [String],
        alt: String,
      },
    },
  }),
  "configuracion_hrapp"
);

module.exports = ConfiguracionHRApp;
