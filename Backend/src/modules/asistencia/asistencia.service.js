const asistenciaRepository = require('./asistencia.repository')
const pool = require('../../config/db')

const registrarAsistencia = async (numero_identificacion) => {
    const reserva = await asistenciaRepository.registrarAsistencia(numero_identificacion)

    // Verificar inasistencias y desactivar si llega a 3
    const estudiante = await pool.query(
        'SELECT * FROM estudiante WHERE numero_identificacion = $1',
        [numero_identificacion]
    )

    return reserva
}

const getAsistenciasPorFecha = async (fecha) => {
    return await asistenciaRepository.getAsistenciasPorFecha(fecha)
}

module.exports = { registrarAsistencia, getAsistenciasPorFecha }