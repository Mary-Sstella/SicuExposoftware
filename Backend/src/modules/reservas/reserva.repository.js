const pool = require('../../config/db')

const createReserva = async (data) => {
    // Verificar cupo en el rango horario seleccionado
    const config = await pool.query(
        'SELECT * FROM configuracion_turnos WHERE id_configuracion = $1 AND activo = true',
        [data.id_configuracion]
    )

    if (config.rows.length === 0) {
        throw new Error('RANGO_NO_ENCONTRADO')
    }

    const rango = config.rows[0]

    // Contar reservas existentes para esa fecha y rango
    const reservasExistentes = await pool.query(
        `SELECT COUNT(*) FROM reservas 
        WHERE fecha = $1 
        AND hora_inicio = $2`,
        [data.fecha, rango.hora_inicio]
    )

    const ocupados = parseInt(reservasExistentes.rows[0].count)

    if (ocupados >= rango.capacidad_maxima) {
        throw new Error('SIN_CUPO')
    }

    // Asignar siguiente número de turno
    const numeroTurno = ocupados + 1

    const result = await pool.query(
        `INSERT INTO reservas 
        (id_estudiante, fecha, lunes, martes, miercoles, jueves, viernes, estado, numero_identificacion, nombre_estudiante, numero_turno, hora_inicio, hora_fin)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDIENTE', $8, $9, $10, $11, $12)
        RETURNING *`,
        [
            data.id_estudiante,
            data.fecha,
            data.lunes,
            data.martes,
            data.miercoles,
            data.jueves,
            data.viernes,
            data.numero_identificacion,
            data.nombre_estudiante,
            numeroTurno,
            rango.hora_inicio,
            rango.hora_fin
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
        ORDER BY r.hora_inicio ASC, r.numero_turno ASC, e.apellidos ASC`
    )
    return result.rows
}

module.exports = { createReserva, getAsistenciaHoy }