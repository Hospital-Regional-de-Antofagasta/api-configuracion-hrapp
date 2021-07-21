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

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
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

module.exports = app;
