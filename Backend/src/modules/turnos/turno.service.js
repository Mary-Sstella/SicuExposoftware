const turnoRepository = require('./turno.repository')

const asignarTurnos = async (fecha) => {
    return await turnoRepository.asignarTurnos(fecha)
}

const getTurnosPorFecha = async (fecha) => {
    return await turnoRepository.getTurnosPorFecha(fecha)
}

const getTurnoEstudiante = async (id_estudiante) => {
    return await turnoRepository.getTurnoEstudiante(id_estudiante)
}

module.exports = { asignarTurnos, getTurnosPorFecha, getTurnoEstudiante }