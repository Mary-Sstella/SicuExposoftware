const { Router } = require('express')
<<<<<<< HEAD:Backend/src/modules/biometria/biometria.routes.js
const controller = require('./biometria.controller')
const { enviarComandoESP32, guardarOperacion } = require('../../shared/websocket')
=======
const controller = require('../controllers/biometria.controller')
>>>>>>> 3e9fbb1942619f49aed9d576bdd0703e5e23e5ee:Backend/src/routes/biometria.routes.js

const router = Router()

// ── Rutas existentes ──────────────────────────────────
router.post('/registrar',         controller.registrarHuella)
router.get('/estudiante/:cedula', controller.getEstudiantePorCedula)
router.post('/validar',           controller.validarHuella)

// ── Iniciar registro remoto ───────────────────────────
router.post('/iniciar-registro', (req, res) => {
    const { finger_id, id_estudiante } = req.body
    if (!finger_id || !id_estudiante) {
        return res.status(400).json({ success: false, mensaje: 'finger_id e id_estudiante requeridos' })
    }

    const enviado = enviarComandoESP32({ comando: 'INICIAR_REGISTRO', finger_id })
    if (!enviado) return res.status(503).json({ success: false, mensaje: 'ESP32 no conectado' })

    // Guardar contexto: cuando llegue REGISTRO_OK, crear en BD
    guardarOperacion({ tipo: 'REGISTRAR', id_estudiante, finger_id_nuevo: finger_id })

    res.json({ success: true, mensaje: 'Registro iniciado, espera eventos WebSocket' })
})

// ── Cancelar registro ─────────────────────────────────
router.post('/cancelar-registro', (req, res) => {
    enviarComandoESP32({ comando: 'CANCELAR_REGISTRO' })
    guardarOperacion(null)
    res.json({ success: true, mensaje: 'Registro cancelado' })
})

// ── Eliminar huella ───────────────────────────────────
router.delete('/eliminar/:finger_id', (req, res) => {
    const finger_id = parseInt(req.params.finger_id)
    if (!finger_id) return res.status(400).json({ success: false, mensaje: 'finger_id requerido' })

    const enviado = enviarComandoESP32({ comando: 'ELIMINAR_HUELLA', finger_id })
    if (!enviado) return res.status(503).json({ success: false, mensaje: 'ESP32 no conectado' })

    // Guardar contexto: cuando llegue ELIMINACION_OK, borrar de BD
    guardarOperacion({ tipo: 'ELIMINAR', finger_id })

    res.json({ success: true, mensaje: 'Comando enviado al sensor' })
})

// ── Actualizar huella ─────────────────────────────────
router.put('/actualizar/:finger_id_viejo', (req, res) => {
    const finger_id_viejo = parseInt(req.params.finger_id_viejo)
    const { finger_id_nuevo, id_estudiante } = req.body

    if (!finger_id_nuevo || !id_estudiante) {
        return res.status(400).json({ success: false, mensaje: 'finger_id_nuevo e id_estudiante requeridos' })
    }

    const enviado = enviarComandoESP32({ 
        comando: 'ACTUALIZAR_HUELLA', 
        finger_id_viejo, 
        finger_id_nuevo 
    })
    if (!enviado) return res.status(503).json({ success: false, mensaje: 'ESP32 no conectado' })

    // Guardar contexto: cuando llegue REGISTRO_OK, actualizar BD
    guardarOperacion({ tipo: 'ACTUALIZAR', id_estudiante, finger_id_viejo, finger_id_nuevo })

    res.json({ success: true, mensaje: 'Actualización iniciada, espera eventos WebSocket' })
})

module.exports = router