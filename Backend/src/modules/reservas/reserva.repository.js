const pool = require('../../config/db')

const createReserva = async (data) => {
    const result = await pool.query(
        `INSERT INTO reservas 
        (id_estudiante, fecha, lunes, martes, miercoles, jueves, viernes, estado, numero_identificacion, nombre_estudiante, numero_turno)
        VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, 'PENDIENTE', $7, $8, $9)
        RETURNING *`,
        [
            data.id_estudiante,
            data.lunes,
            data.martes,
            data.miercoles,
            data.jueves,
            data.viernes,
            data.numero_identificacion,
            data.nombre_estudiante,
            data.numero_turno
        ]
    )
    return result.rows[0]
}

const getAsistenciaHoy = async () => {
    const diaSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][new Date().getDay()]

    const result = await pool.query(
        `SELECT
            r.hora_inicio AS hora_reserva,
            e.nombres,
            e.apellidos,
            e.numero_identificacion,
            e.programa AS carrera,
            r.numero_turno AS turno,
            r.metodo,
            r.estado
        FROM reservas r
        JOIN estudiante e ON r.id_estudiante = e.id_estudiante
        WHERE r.fecha = CURRENT_DATE
        AND r.${diaSemana} = true
        ORDER BY r.numero_turno ASC, e.apellidos ASC`
    )
    return result.rows
}

module.exports = { createReserva, getAsistenciaHoy }