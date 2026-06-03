require('dotenv').config()
const env = require('./config/env')
const { createApp } = require('./app')
const app = createApp()
const { iniciarCronJobs } = require('./jobs/cronJobs')

BigInt.prototype.toJSON = function() {
    return this.toString()
}

const PORT = env.port || 3000

const server = app.listen(PORT, () => {
    console.log(`Servidor se levantó en el puerto ${PORT}`)
    iniciarCronJobs()
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