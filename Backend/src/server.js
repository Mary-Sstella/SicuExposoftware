require('dotenv').config()
const env = require('./config/env')
<<<<<<< HEAD
const app = require('./app')
const http = require('http')
const { Bonjour } = require('bonjour-service')
const { iniciarWebSocket } = require('./shared/websocket')
const { iniciarCronJobs } = require('./shared/utils/cronJobs')
=======
const { createApp } = require('./app')
const app = createApp()
const { iniciarCronJobs } = require('./jobs/cronJobs')
>>>>>>> 3e9fbb1942619f49aed9d576bdd0703e5e23e5ee

BigInt.prototype.toJSON = function() {
    return this.toString()
}

const PORT = env.port || 3000

const server = http.createServer(app)

// ── WebSocket ─────────────────────────────────────────
iniciarWebSocket(server)

// ── mDNS ──────────────────────────────────────────────
const bonjour = new Bonjour()
bonjour.publish({ name: 'sicu-backend', type: 'http', port: PORT })
console.log('✅ mDNS registrado → sicu-backend.local')

server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
    iniciarCronJobs()
})

const shutdown = (signal) => {
    console.log(`\n${signal} recibido. Cerrando servidor...`)
    bonjour.unpublishAll()
    server.close(() => {
        console.log('Servidor cerrado correctamente')
        process.exit(0)
    })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))