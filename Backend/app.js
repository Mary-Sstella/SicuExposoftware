const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const pool = require('./config/db')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', routes)

//Probando conexión a la base de datos
pool.connect()
    .then(() => console.log('Conexion exitosa a la base de datos'))
    .catch(err => console.error('Error en la conexión:', err))

module.exports = app