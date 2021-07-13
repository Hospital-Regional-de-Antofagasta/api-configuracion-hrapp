const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ubicaciones = require("./routes/ubicaciones");
const diasFeriados = require("./routes/diasFeriados");
const mensajesInformacion = require("./routes/mensajesInformacion");
const menus = require("./routes/menus");
const configuracionHRApp = require("./routes/configuracionHRApp");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/v1/datos_externos/ubicaciones", ubicaciones);

app.use("/v1/datos_externos/dias_feriados", diasFeriados);

app.use("/v1/configuracion_hrapp/ubicaciones", ubicaciones);

app.use("/v1/configuracion_hrapp/dias_feriados", diasFeriados);

app.use("/v1/configuracion_hrapp/mensajes_informacion", mensajesInformacion);

app.use("/v1/configuracion_hrapp/menu", menus);

app.use("/v1/configuracion_hrapp", configuracionHRApp);

module.exports = app;
