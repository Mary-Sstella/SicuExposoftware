const WebSocket = require('ws')
const prisma = require('./config/prisma')

let wss = null
let operacionPendiente = null
let esp32Client = null  // referencia exclusiva al ESP32

const iniciarWebSocket = (server) => {
    wss = new WebSocket.Server({ server, path: '/sicu/ws' })

    wss.on('connection', (ws) => {
        console.log(' Cliente conectado por WebSocket')

        ws.isESP32 = false  // por defecto es frontend

        ws.on('message', async (msg) => {
            const texto = msg.toString()

            let data
            try {
                data = JSON.parse(texto)
            } catch {
                return
            }

            // ── Identificar si es el ESP32 ────────────────
            if (data.tipo === 'DISPOSITIVO' && data.id === 'ESP32_COMEDOR') {
                ws.isESP32 = true
                esp32Client = ws
                console.log(' ESP32 identificado y registrado')
                notificarFrontend({ evento: 'ESP32_CONECTADO' })
                return
            }

            // ── Identificar frontend y responder con estado actual ──
            if (data.tipo === 'DISPOSITIVO' && data.id === 'FRONTEND') {
                const conectado = esp32Client && esp32Client.readyState === WebSocket.OPEN
                ws.send(JSON.stringify({ evento: conectado ? 'ESP32_CONECTADO' : 'ESP32_DESCONECTADO' }))
                return
            }

            // ── Solo procesar mensajes del ESP32 ──────────
            if (!ws.isESP32) return

            console.log(' ESP32:', texto)
            const evento = data.evento

            // ── REGISTRO_OK ───────────────────────────────
            if (evento === 'REGISTRO_OK') {
                if (!operacionPendiente) return

                const { tipo, id_estudiante, finger_id_viejo } = operacionPendiente

                try {
                    if (tipo === 'REGISTRAR') {
                        await prisma.huellas.upsert({
                            where: { finger_id: data.finger_id },
                            update: { id_estudiante },
                            create: { id_estudiante, finger_id: data.finger_id }
                        })
                        console.log(' Huella registrada en BD')
                        notificarFrontend({ evento: 'REGISTRO_BD_OK', mensaje: 'Huella registrada correctamente' })

                    } else if (tipo === 'ACTUALIZAR') {
                        const huellaVieja = await prisma.huellas.findUnique({
                            where: { finger_id: finger_id_viejo }
                        })

                        if (huellaVieja) {
                            await prisma.huellas.delete({
                                where: { finger_id: finger_id_viejo }
                            })
                        }

                        await prisma.huellas.upsert({
                            where: { finger_id: data.finger_id },
                            update: { id_estudiante },
                            create: { id_estudiante, finger_id: data.finger_id }
                        })
                        console.log(' Huella actualizada en BD')
                        notificarFrontend({ evento: 'ACTUALIZACION_BD_OK', mensaje: 'Huella actualizada correctamente' })
                    }
                } catch (err) {
                    console.error(' Error actualizando BD:', err.message)
                    notificarFrontend({ evento: 'ERROR_BD', mensaje: 'Error guardando en base de datos' })
                }

                operacionPendiente = null
            }

            // ── ELIMINACION_OK ────────────────────────────
            else if (evento === 'ELIMINACION_OK') {
                if (!operacionPendiente) return

                const { finger_id } = operacionPendiente

                try {
                    const huella = await prisma.huellas.findUnique({
                        where: { finger_id }
                    })

                    if (huella) {
                        await prisma.huellas.delete({ where: { finger_id } })
                        console.log(' Huella eliminada de BD')
                    } else {
                        console.warn(' Huella no encontrada en BD')
                    }
                    notificarFrontend({ evento: 'ELIMINACION_BD_OK', mensaje: 'Huella eliminada correctamente' })
                } catch (err) {
                    console.error(' Error eliminando de BD:', err.message)
                    notificarFrontend({ evento: 'ERROR_BD', mensaje: 'Error eliminando de base de datos' })
                }

                operacionPendiente = null
            }

            // ── Reenviar todos los demás eventos al frontend ─
            else {
                notificarFrontend(data)
            }
        })

        ws.on('close', () => {
            if (ws.isESP32) {
                console.log(' ESP32 desconectado')
                esp32Client = null
                notificarFrontend({ evento: 'ESP32_DESCONECTADO' })
            } else {
                console.log(' Frontend desconectado')
            }
        })
    })
}

// Enviar comando SOLO al ESP32
const enviarComandoESP32 = (comando) => {
    if (!esp32Client || esp32Client.readyState !== WebSocket.OPEN) {
        console.warn(' ESP32 no conectado')
        return false
    }
    esp32Client.send(JSON.stringify(comando))
    return true
}

// Notificar SOLO a los clientes frontend (no al ESP32)
const notificarFrontend = (data) => {
    if (!wss) return
    wss.clients.forEach(client => {
        if (!client.isESP32 && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data))
        }
    })
}

const guardarOperacion = (operacion) => {
    operacionPendiente = operacion
}

module.exports = { iniciarWebSocket, enviarComandoESP32, guardarOperacion, notificarFrontend }