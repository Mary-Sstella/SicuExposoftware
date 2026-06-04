require('dotenv').config()
const env = require('./config/env')
const app = require('./app')
const http = require('http')
const { iniciarWebSocket } = require('./shared/websocket')
const { iniciarCronJobs } = require('./shared/utils/cronJobs')

BigInt.prototype.toJSON = function() {
    return this.toString()
}

const PORT = env.port || 3000

const server = http.createServer(app)

// ── WebSocket ─────────────────────────────────────────
iniciarWebSocket(server)

server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
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
