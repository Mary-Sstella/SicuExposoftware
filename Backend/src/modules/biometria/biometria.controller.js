const biometriaService = require('./biometria.service')
const { AppError } = require('../../shared/middleware/error.middleware')
const { notificarFrontend } = require('../../shared/websocket')

const validarHuella = async (req, res, next) => {
    try {
        const { finger_id } = req.body
        if (!finger_id) return next(new AppError(400, 'finger_id es requerido'))

        const resultado = await biometriaService.validarHuella(parseInt(finger_id))

        // Notificar al frontend por WebSocket con el resultado
        notificarFrontend({
            evento: 'ASISTENCIA_RESULTADO',
            success: resultado.success,
            mensaje: resultado.mensaje,
            estudiante: resultado.estudiante ?? null
        })

        return res.json(resultado)
    } catch (error) {
        next(error)
    }
}

const registrarHuella = async (req, res, next) => {
    try {
        const { id_estudiante, finger_id } = req.body
        if (!id_estudiante || !finger_id) return next(new AppError(400, 'id_estudiante y finger_id son requeridos'))
        await biometriaService.registrarHuella(parseInt(id_estudiante), parseInt(finger_id))
        return res.json({ msg: 'Huella registrada correctamente' })
    } catch (error) { next(error) }
}

const getEstudiantePorCedula = async (req, res, next) => {
    try {
        const { cedula } = req.params
        const estudiante = await biometriaService.getEstudiantePorCedula(cedula)
        if (!estudiante) return next(new AppError(404, 'Estudiante no encontrado'))
        return res.json(estudiante)
    } catch (error) { next(error) }
}

module.exports = { validarHuella, registrarHuella, getEstudiantePorCedula }