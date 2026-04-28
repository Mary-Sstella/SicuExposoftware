const turnoService = require('./turno.service')
const { AppError } = require('../../shared/middleware/error.middleware')
const { MESSAGES } = require('../../shared/constants/messages')
const pool = require('../../config/db')

const asignarTurnos = async (req, res, next) => {
    try {
        const { fecha } = req.body

        if (!fecha) {
            throw new AppError(400, 'La fecha es requerida')
        }

        const data = await turnoService.asignarTurnos(fecha)

        await pool.query(
            `INSERT INTO actividades (tipo, descripcion, id_usuario) VALUES ($1, $2, $3)`,
            ['TURNOS_ASIGNADOS', `Turnos asignados para el día: ${fecha}`, req.usuario.id]
        )

        res.json({ msg: MESSAGES.TURNOS_ASIGNADOS, total: data.total })
    } catch (error) {
        if (error.message === 'SIN_RESERVAS') {
            return next(new AppError(404, MESSAGES.SIN_RESERVAS))
        }
        next(error)
    }
}

const getTurnosPorFecha = async (req, res, next) => {
    try {
        const { fecha } = req.query

        if (!fecha) {
            throw new AppError(400, 'La fecha es requerida')
        }

        const data = await turnoService.getTurnosPorFecha(fecha)
        res.json(data)
    } catch (error) {
        next(error)
    }
}

const getTurnoEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await turnoService.getTurnoEstudiante(id)

        if (!data) {
            throw new AppError(404, MESSAGES.TURNO_NO_ENCONTRADO)
        }

        res.json(data)
    } catch (error) {
        next(error)
    }
}

module.exports = { asignarTurnos, getTurnosPorFecha, getTurnoEstudiante }