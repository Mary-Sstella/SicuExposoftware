const turnoService = require('./turno.service')
const { AppError } = require('../../shared/middleware/error.middleware')
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

        res.json({ msg: data.mensaje, total: data.total })
    } catch (error) {
        if (error.message === 'SIN_RESERVAS') {
            return next(new AppError(404, 'No hay reservas para esa fecha'))
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
            throw new AppError(404, 'No hay turno asignado para hoy')
        }

        res.json(data)
    } catch (error) {
        next(error)
    }
}

module.exports = { asignarTurnos, getTurnosPorFecha, getTurnoEstudiante }