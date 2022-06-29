require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ubicaciones = require("./routes/ubicaciones");
const diasFeriados = require("./routes/diasFeriados");
const mensajesInformacion = require("./routes/mensajesInformacion");
const menus = require("./routes/menus");
const configuracionHRApp = require("./routes/configuracionHRApp");
const misionVision = require("./routes/misionVision");
const unidades = require("./routes/unidades");
const versiones = require("./routes/versiones");
const slidesGuiaInicio = require("./routes/slidesGuiaInicio");
const seccionAyuda = require("./routes/seccionAyuda");
const diccionarioSiglas = require("./routes/diccionarioSiglas");
const diccionarioDispositivos = require("./routes/diccionarioDispositivos");

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(cors());

const connection = process.env.MONGO_URI
const port = process.env.PORT
const localhost = process.env.HOSTNAME

mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/v1/configuracion-hrapp/ubicaciones", ubicaciones);

app.use("/v1/configuracion-hrapp/dias-feriados", diasFeriados);

app.use("/v1/configuracion-hrapp/mensajes-informacion", mensajesInformacion);

app.use("/v1/configuracion-hrapp/menu", menus);

app.use("/v1/configuracion-hrapp", configuracionHRApp);

app.use("/v1/configuracion-hrapp/mision-vision", misionVision);

app.use("/v1/configuracion-hrapp/unidades", unidades);

app.use("/v1/configuracion-hrapp/version", versiones);

app.use("/v1/configuracion-hrapp/slides-guia-inicio", slidesGuiaInicio);

app.use("/v1/configuracion-hrapp/seccion-ayuda", seccionAyuda);

app.use("/v1/configuracion-hrapp/diccionario-siglas", diccionarioSiglas);

app.use("/v1/configuracion-hrapp/diccionario_dispositivos", diccionarioDispositivos);

if (require.main === module) { // true if file is executed
  process.on("SIGINT",function (){
    process.exit();
  });
  app.listen(port, () => {
    console.log(`App listening at http://${localhost}:${port}`)
  })
}

module.exports = app;
