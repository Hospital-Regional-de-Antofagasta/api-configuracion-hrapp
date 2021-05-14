const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = require('../index')
const Regiones = require('../models/Regiones')
const Provincias = require('../models/Provincias')
const Ciudades = require('../models/Ciudades')
const Comunas = require('../models/Comunas')
const regionesSeed = require('../testSeeds/regionesSeed')
const provinciasSeed = require('../testSeeds/provinciasSeed')
const ciudadesSeed = require('../testSeeds/ciudadesSeed')
const comunasSeed = require('../testSeeds/comunasSeed')
const { mensajes } = require('../config')

const request = supertest(app)

const secret = process.env.JWT_SECRET

beforeEach(async () => {
    await mongoose.disconnect()
    await mongoose.connect(`${process.env.MONGO_URI_TEST}ubicaciones`, { useNewUrlParser: true, useUnifiedTopology: true })
    await Regiones.create(regionesSeed)
    await Provincias.create(provinciasSeed)
    await Ciudades.create(ciudadesSeed)
    await Comunas.create(comunasSeed)
})

afterEach(async () => {
    await Regiones.deleteMany()
    await Provincias.deleteMany()
    await Ciudades.deleteMany()
    await Comunas.deleteMany()
    await mongoose.disconnect()
})

describe('Endpoints ubicaciones', () => {
    describe('Get lista de ubicaciones', () => {
        it('Should not return lista de ubicaciones', async (done) => {
            const response = await request.get('/hra/datos_externos/ubicaciones/')
                .set('Authorization', 'no-token')

            expect(response.status).toBe(401)
            expect(response.body).toEqual({ respuesta: mensajes.forbiddenAccess })

            done()
        })
        it('Should return lista de ubicaciones', async (done) => {
            const token = jwt.sign({ numeroPaciente: 2 }, secret)
            const response = await request.get('/hra/datos_externos/ubicaciones/')
                .set('Authorization', token)

            const regionesObtenidas = await Regiones.find().exec()
            const provinciasObtenidas = await Provincias.find().exec()
            const ciudadesObtenidas = await Ciudades.find().exec()
            const comunasObtenidas = await Comunas.find().exec()

            console.log(response.body[0][0].nombre)

            expect(response.status).toBe(200)
            expect(response.body[0].length).toEqual(regionesObtenidas.length)
            expect(response.body[1].length).toEqual(provinciasObtenidas.length)
            expect(response.body[2].length).toEqual(ciudadesObtenidas.length)
            expect(response.body[3].length).toEqual(comunasObtenidas.length)

            done()
        })
        it('Should return empty lista de ubicaciones', async (done) => {
            await Regiones.deleteMany()
            await Provincias.deleteMany()
            await Ciudades.deleteMany()
            await Comunas.deleteMany()

            const token = jwt.sign({ numeroPaciente: 2 }, secret)
            const response = await request.get('/hra/datos_externos/ubicaciones/')
                .set('Authorization', token)

            expect(response.status).toBe(200)
            expect(response.body[0].length).toBeFalsy()
            expect(response.body[1].length).toBeFalsy()
            expect(response.body[2].length).toBeFalsy()
            expect(response.body[3].length).toBeFalsy()

            done()
        })
    })
})