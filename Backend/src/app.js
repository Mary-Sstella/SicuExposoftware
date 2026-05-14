const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const routes = require('./routes')
const pool = require('./config/db')
const { apiLimiter } = require('./shared/middleware/rateLimiter.middleware')
const { errorHandler } = require('./shared/middleware/error.middleware')
const { loggerMiddleware } = require('./shared/middleware/logger.middleware')

const app = express()

const whitelist = ['http://localhost:5174', 'http://localhost:5173']

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) { // quitar !origin cuando no necesite las pruebas de postman 
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

// Middlewares globales
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(loggerMiddleware)

// Rutas
app.use('/sicu', apiLimiter)
app.use('/sicu', routes)

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use(errorHandler)

//probando conexion a la base de datos
pool.connect()
    .then(() => console.log('Conexion exitosa a la base de datos'))
    .catch(err => console.error('Error en la conexión:', err))

module.exports = app