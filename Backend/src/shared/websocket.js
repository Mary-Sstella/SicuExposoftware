const WebSocket = require('ws')
const prisma = require('../config/prisma')

let wss = null

// ─── Contexto de operación pendiente ─────────────────
// Guarda qué operación está en curso y para qué estudiante
let operacionPendiente = null

// ─────────────────────────────────────────────────────
const iniciarWebSocket = (server) => {
    wss = new WebSocket.Server({ server })

    wss.on('connection', (ws) => {
        console.log('🔗 ESP32 conectado por WebSocket')

        ws.on('message', async (msg) => {
            const texto = msg.toString()
            console.log('📨 ESP32:', texto)

            let data
            try {
                data = JSON.parse(texto)
            } catch {
                return
            }

            const evento = data.evento

            // ── REGISTRO_OK ───────────────────────────
            // Llega cuando el sensor guardó la huella nueva
            if (evento === 'REGISTRO_OK') {
                if (!operacionPendiente) return

                const { tipo, id_estudiante, finger_id_viejo, finger_id_nuevo } = operacionPendiente

                try {
                    if (tipo === 'REGISTRAR') {
                        // Guardar huella nueva en BD
                        await prisma.huellas.create({
                            data: {
                                id_estudiante,
                                finger_id: data.finger_id
                            }
                        })
                        console.log('✅ Huella registrada en BD')
                        notificarFrontend({ evento: 'REGISTRO_BD_OK', mensaje: 'Huella registrada correctamente' })

                    } else if (tipo === 'ACTUALIZAR') {
                        // Eliminar vieja y crear nueva en BD
                        await prisma.huellas.delete({
                            where: { finger_id: finger_id_viejo }
                        })
                        await prisma.huellas.create({
                            data: {
                                id_estudiante,
                                finger_id: data.finger_id
                            }
                        })
                        console.log('✅ Huella actualizada en BD')
                        notificarFrontend({ evento: 'ACTUALIZACION_BD_OK', mensaje: 'Huella actualizada correctamente' })
                    }
                } catch (err) {
                    console.error('❌ Error actualizando BD:', err.message)
                    notificarFrontend({ evento: 'ERROR_BD', mensaje: 'Error guardando en base de datos' })
                }

                operacionPendiente = null
            }

            // ── ELIMINACION_OK ────────────────────────
            // Llega cuando el sensor eliminó la huella
            else if (evento === 'ELIMINACION_OK') {
                if (!operacionPendiente) return

                const { id_estudiante, finger_id } = operacionPendiente

                try {
                    await prisma.huellas.delete({
                        where: { finger_id }
                    })
                    console.log('✅ Huella eliminada de BD')
                    notificarFrontend({ evento: 'ELIMINACION_BD_OK', mensaje: 'Huella eliminada correctamente' })
                } catch (err) {
                    console.error('❌ Error eliminando de BD:', err.message)
                    notificarFrontend({ evento: 'ERROR_BD', mensaje: 'Error eliminando de base de datos' })
                }

                operacionPendiente = null
            }

            // ── Reenviar todos los eventos al frontend ─
            else {
                notificarFrontend(data)
            }
        })

        ws.on('close', () => {
            console.log('🔌 ESP32 desconectado')
        })
    })
}

// ─────────────────────────────────────────────────────
// Enviar comando al ESP32
// ─────────────────────────────────────────────────────
const enviarComandoESP32 = (comando) => {
    if (!wss) return false

    let enviado = false
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(comando))
            enviado = true
        }
    })
    return enviado
}

// ─────────────────────────────────────────────────────
// Notificar al frontend (todos los clientes web)
// ─────────────────────────────────────────────────────
const notificarFrontend = (data) => {
    if (!wss) return
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data))
        }
    })
}

// ─────────────────────────────────────────────────────
// Guardar contexto de operación pendiente
// ─────────────────────────────────────────────────────
const guardarOperacion = (operacion) => {
    operacionPendiente = operacion
}

module.exports = { iniciarWebSocket, enviarComandoESP32, guardarOperacion }