const turnoRepository = require('./turno.repository')

const getConfiguracionTurnos = async () => {
    return await turnoRepository.getConfiguracionTurnos()
}

const getDisponibilidad = async (fecha) => {
    return await turnoRepository.getDisponibilidad(fecha)
}

const asignarTurnoAutomatico = async (id_estudiante, fecha, id_configuracion) => {
    return await turnoRepository.asignarTurnoAutomatico(id_estudiante, fecha, id_configuracion)
}

const getTurnosPorFecha = async (fecha) => {
    return await turnoRepository.getTurnosPorFecha(fecha)
}

const getTurnoEstudiante = async (id_estudiante) => {
    return await turnoRepository.getTurnoEstudiante(id_estudiante)
}

module.exports = {
    getConfiguracionTurnos,
    getDisponibilidad,
    asignarTurnoAutomatico,
    getTurnosPorFecha,
    getTurnoEstudiante
}