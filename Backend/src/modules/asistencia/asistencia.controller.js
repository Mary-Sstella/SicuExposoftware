const asistenciaService = require('./asistencia.service')
const { AppError } = require('../../shared/middleware/error.middleware')
const { MESSAGES } = require('../../shared/constants/messages')
const pool = require('../../config/db')

const registrarAsistencia = async (req, res, next) => {
    try {
        const { numero_identificacion } = req.body

        const data = await asistenciaService.registrarAsistencia(numero_identificacion)

        await pool.query(
            `INSERT INTO actividades (tipo, descripcion, id_usuario) VALUES ($1, $2, $3)`,
            ['ASISTENCIA_REGISTRADA', `Asistencia registrada para: ${data.nombre_estudiante}`, req.usuario.id]
        )

        res.json({ msg: MESSAGES.ASISTENCIA_REGISTRADA, reserva: data })
    } catch (error) {
        if (error.message === 'SIN_RESERVA') {
            return next(new AppError(404, MESSAGES.SIN_RESERVA))
        }
        if (error.message === 'YA_REGISTRADA') {
            return next(new AppError(409, MESSAGES.YA_REGISTRADA))
        }
        next(error)
    }
}

const getAsistenciasPorFecha = async (req, res, next) => {
    try {
        const { fecha } = req.query

        if (!fecha) {
            throw new AppError(400, 'La fecha es requerida')
        }

        const data = await asistenciaService.getAsistenciasPorFecha(fecha)
        res.json(data)
    } catch (error) {
        next(error)
    }
}

module.exports = { registrarAsistencia, getAsistenciasPorFecha }