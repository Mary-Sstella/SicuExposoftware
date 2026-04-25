const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const routes = require('./routes')
const pool = require('./config/db')
const { apiLimiter } = require('./shared/middleware/rateLimiter.middleware')
const { errorHandler } = require('./shared/middleware/error.middleware')

const app = express()

// Middlewares globales 
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rutas
app.use('/sicu', apiLimiter)
app.use('/sicu', routes)

// Error handler 
app.use(errorHandler)

//Probando conexión a la base de datos
pool.connect()
    .then(() => console.log('Conexion exitosa a la base de datos'))
    .catch(err => console.error('Error en la conexión:', err))

module.exports = app