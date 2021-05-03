const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ubicaciones = require('./routes/ubicaciones')
const { loadConfig } = require('./config')

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

loadConfig()

app.use('/hra/datos_externos/ubicaciones', ubicaciones)

module.exports = app
