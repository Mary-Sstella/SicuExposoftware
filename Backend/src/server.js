require('dotenv').config()
const env = require('./config/env')
const app = require('./app')

const PORT = env.port || 3000

const server = app.listen(PORT, () => {
    console.log(`Servidor se levantó en el puerto ${PORT}`)
})

const shutdown = (signal) => {
    console.log(`\n${signal} recibido. Cerrando servidor...`)
    server.close(() => {
        console.log('Servidor cerrado correctamente')
        process.exit(0)
    })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))