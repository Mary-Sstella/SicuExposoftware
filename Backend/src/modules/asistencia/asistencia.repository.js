const pool = require('../../config/db')

// Registrar asistencia cambiando estado de reserva a ENTREGADA
const registrarAsistencia = async (numero_identificacion) => {
    const hoy = new Date().toISOString().split('T')[0]
    const diaSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][new Date().getDay()]

    // Verificar que el estudiante tiene reserva para hoy
    const reserva = await pool.query(
        `SELECT r.* FROM reservas r
         JOIN estudiante e ON r.id_estudiante = e.id_estudiante
         WHERE e.numero_identificacion = $1
         AND r.fecha = $2
         AND r.${diaSemana} = true`,
        [numero_identificacion, hoy]
    )

    if (reserva.rows.length === 0) {
        throw new Error('SIN_RESERVA')
    }

    if (reserva.rows[0].estado === 'ENTREGADA') {
        throw new Error('YA_REGISTRADA')
    }

    // Cambiar estado a ENTREGADA
    const result = await pool.query(
        `UPDATE reservas SET estado = 'ENTREGADA'
         WHERE id_reserva = $1
         RETURNING *`,
        [reserva.rows[0].id_reserva]
    )

    return result.rows[0]
}

// Obtener asistencias por fecha
const getAsistenciasPorFecha = async (fecha) => {
    const result = await pool.query(
        `SELECT 
            r.id_reserva,
            r.estado,
            r.numero_turno,
            r.fecha,
            e.nombres,
            e.apellidos,
            e.numero_identificacion,
            e.programa
        FROM reservas r
        JOIN estudiante e ON r.id_estudiante = e.id_estudiante
        WHERE r.fecha = $1
        ORDER BY r.numero_turno ASC, e.apellidos ASC`,
        [fecha]
    )
    return result.rows
}

module.exports = { registrarAsistencia, getAsistenciasPorFecha }