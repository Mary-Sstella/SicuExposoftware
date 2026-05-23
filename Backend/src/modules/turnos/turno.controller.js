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

const getReservaActiva = async (req, res, next) => {
    try {
        const { id } = req.params
        const reserva = await turnoService.getReservaActiva(id)
        res.json(reserva || null)
    } catch (error) {
        next(error)
    }
}

const crearReserva = async (req, res, next) => {
    try {
        const { id } = req.params
        const { fecha, id_configuracion } = req.body
        const reserva = await turnoService.crearReserva(id, fecha, id_configuracion)
        res.status(201).json(reserva)
    } catch (error) {
        const errores = {
            RANGO_NO_DISPONIBLE: [400, 'El rango horario no está disponible'],
            FECHA_INVALIDA: [400, 'Debes reservar con al menos un día de anticipación'],
            DIA_NO_HABILITADO: [400, 'No tienes este día habilitado para almorzar'],
            YA_TIENE_RESERVA: [409, 'Ya tienes una reserva activa pendiente'],
            SIN_CAPACIDAD:       [400, 'No hay cupos disponibles en ese rango horario'],
            SIN_PAGO_PARA_DIA:   [403, 'No tienes un pago aprobado para ese día de la semana'],
        }
        const [status, msg] = errores[error.message] ?? [500, 'Error al crear la reserva']
        next(new AppError(status, msg))
    }
}

const getDiasEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params
        const dias = await turnoService.getDiasEstudiante(id)
        res.json(dias ?? { lunes: false, martes: false, miercoles: false, jueves: false, viernes: false })
    } catch (error) {
        next(error)
    }
}

const getHistorialEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params
        const historial = await turnoService.getHistorialEstudiante(id)
        res.json(historial)
    } catch (error) {
        next(error)
    }
}

const getFechasPagadas = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await turnoService.getFechasPagadas(id)
        res.json(data)
    } catch (error) {
        next(error)
    }
}

const getEstudianteStats = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await turnoService.getEstudianteStats(id)
        res.json(data)
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getConfiguracionTurnos,
    getDisponibilidad,
    getTurnosPorFecha,
    getTurnoEstudiante,
    updateConfiguracion,
    getReservaActiva,
    crearReserva,
    getDiasEstudiante,
    getHistorialEstudiante,
    getFechasPagadas,
    getEstudianteStats
}