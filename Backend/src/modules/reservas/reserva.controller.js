const reservaService = require('./reserva.service')
const { AppError } = require('../../shared/middleware/error.middleware')
const { MESSAGES } = require('../../shared/constants/messages')
const pool = require('../../config/db')

const createReserva = async (req, res, next) => {
    try {
        const data = await reservaService.createReserva(req.body)

        await pool.query(
            `INSERT INTO actividades (tipo, descripcion, id_usuario) VALUES ($1, $2, $3)`,
            ['RESERVA_CREADA', `Reserva creada para: ${data.nombre_estudiante}`, req.usuario.id]
        )

        res.status(201).json({ msg: MESSAGES.RESERVA_CREADA, reserva: data })
    } catch (error) {
        if (error.message === 'SIN_CUPO') {
            return next(new AppError(409, 'No hay cupo disponible en ese rango horario'))
        }
        if (error.message === 'RANGO_NO_ENCONTRADO') {
            return next(new AppError(404, 'El rango horario no existe'))
        }
        next(error)
    }
}

const getAsistenciaHoy = async (req, res, next) => {
    try {
        const data = await reservaService.getAsistenciaHoy()
        res.json(data)
    } catch (error) {
        next(error)
    }
}

module.exports = { createReserva, getAsistenciaHoy }