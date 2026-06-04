require('dotenv').config()
const env = require('./config/env')
const { createApp } = require('./app')
const app = createApp()
const http = require('http')
const { Bonjour } = require('bonjour-service')
let bonjour = null
const { iniciarWebSocket } = require('./websocket')
const { iniciarCronJobs } = require('./jobs/cronJobs')

BigInt.prototype.toJSON = function() {
    return this.toString()
}

const PORT = env.port || 3000

const server = http.createServer(app)

// ── WebSocket ─────────────────────────────────────────
iniciarWebSocket(server)

// ── mDNS ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
    bonjour = new Bonjour()
    bonjour.publish({ name: 'sicu-backend', type: 'http', port: PORT })
    console.log('✅ mDNS registrado → sicu-backend.local')
}

server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
    iniciarCronJobs()
})

const shutdown = (signal) => {
    console.log(`\n${signal} recibido. Cerrando servidor...`)
    if (bonjour) bonjour.unpublishAll()
    server.close(() => {
        console.log('Servidor cerrado correctamente')
        process.exit(0)
    })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
