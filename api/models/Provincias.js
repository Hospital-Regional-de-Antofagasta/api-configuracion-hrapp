const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Provincia = mongoose.model('provincia', new Schema ({
    codigoRegion: String,
    codigoProvincia: String,
    nombre: String,
}))

module.exports = Provincia