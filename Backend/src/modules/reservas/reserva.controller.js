const reservaService = require('./reserva.service')
const { AppError } = require('../../shared/middleware/error.middleware')
const pool = require('../../config/db')

const createReserva = async (req, res, next) => {
    try {
        const data = await reservaService.createReserva(req.body)

        await pool.query(
            `INSERT INTO actividades (tipo, descripcion, id_usuario) VALUES ($1, $2, $3)`,
            ['RESERVA_CREADA', `Reserva creada para: ${data.nombre_estudiante}`, req.usuario.id]
        )

        res.status(201).json({ msg: 'Reserva creada correctamente', reserva: data })
    } catch (error) {
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