const turnoService = require('./turno.service')
const { AppError } = require('../../shared/middleware/error.middleware')
const { MESSAGES } = require('../../shared/constants/messages')

const getConfiguracionTurnos = async (req, res, next) => {
    try {
        const data = await turnoService.getConfiguracionTurnos()
        res.json(data)
    } catch (error) {
        next(error)
    }
}

const getDisponibilidad = async (req, res, next) => {
    try {
        const { fecha } = req.query

        if (!fecha) {
            throw new AppError(400, 'La fecha es requerida')
        }

        const data = await turnoService.getDisponibilidad(fecha)
        res.json(data)
    } catch (error) {
        next(error)
    }
}

const getTurnosPorFecha = async (req, res, next) => {
    try {
        const { fecha, buscar } = req.query

        if (!fecha) {
            throw new AppError(400, 'La fecha es requerida')
        }

        const data = await turnoService.getTurnosPorFecha(fecha, buscar)
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

const updateConfiguracion = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await turnoService.updateConfiguracion(id, req.body)
        res.json({ msg: 'Configuración actualizada', configuracion: data })
    } catch (error) {
        if (error.message === 'RANGO_NO_ENCONTRADO') {
            return next(new AppError(404, 'El rango horario no existe'))
        }
        next(error)
    }
}

module.exports = {
    getConfiguracionTurnos,
    getDisponibilidad,
    getTurnosPorFecha,
    getTurnoEstudiante,
    updateConfiguracion
}