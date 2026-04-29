const pool = require('../../config/db')

// Obtener configuración de rangos horarios
const getConfiguracionTurnos = async () => {
    const result = await pool.query(
        'SELECT * FROM configuracion_turnos WHERE activo = true ORDER BY hora_inicio ASC'
    )
    return result.rows
}

// Obtener disponibilidad por fecha
const getDisponibilidad = async (fecha) => {
    const configuracion = await pool.query(
        'SELECT * FROM configuracion_turnos WHERE activo = true ORDER BY hora_inicio ASC'
    )

    const disponibilidad = []

    for (const rango of configuracion.rows) {
        const reservas = await pool.query(
            `SELECT COUNT(*) FROM reservas 
            WHERE fecha = $1 
            AND hora_inicio = $2`,
            [fecha, rango.hora_inicio]
        )

        const ocupados = parseInt(reservas.rows[0].count)
        const disponibles = rango.capacidad_maxima - ocupados

        disponibilidad.push({
            id_configuracion: rango.id_configuracion,
            hora_inicio: rango.hora_inicio,
            hora_fin: rango.hora_fin,
            capacidad_maxima: rango.capacidad_maxima,
            ocupados,
            disponibles,
            disponible: disponibles > 0
        })
    }

    return disponibilidad
}

// Asignar turno automáticamente al crear reserva
const asignarTurnoAutomatico = async (id_estudiante, fecha, id_configuracion) => {
    const config = await pool.query(
        'SELECT * FROM configuracion_turnos WHERE id_configuracion = $1',
        [id_configuracion]
    )

    if (config.rows.length === 0) {
        throw new Error('RANGO_NO_ENCONTRADO')
    }

    const rango = config.rows[0]

    // Verificar cupo disponible
    const reservasExistentes = await pool.query(
        `SELECT COUNT(*) FROM reservas 
        WHERE fecha = $1 
        AND hora_inicio = $2`,
        [fecha, rango.hora_inicio]
    )

    const ocupados = parseInt(reservasExistentes.rows[0].count)

    if (ocupados >= rango.capacidad_maxima) {
        throw new Error('SIN_CUPO')
    }

    // Asignar siguiente número de turno
    const numeroTurno = ocupados + 1

    return {
        numero_turno: numeroTurno,
        hora_inicio: rango.hora_inicio,
        hora_fin: rango.hora_fin
    }
}

const getTurnosPorFecha = async (fecha) => {
    const result = await pool.query(
        `SELECT
            r.numero_turno,
            r.hora_inicio,
            r.hora_fin,
            e.nombres,
            e.apellidos,
            e.numero_identificacion,
            e.programa,
            r.estado
        FROM reservas r
        JOIN estudiante e ON r.id_estudiante = e.id_estudiante
        WHERE r.fecha = $1
        ORDER BY r.hora_inicio ASC, r.numero_turno ASC`,
        [fecha]
    )
    return result.rows
}

const getTurnoEstudiante = async (id_estudiante) => {
    const result = await pool.query(
        `SELECT
            r.numero_turno,
            r.hora_inicio,
            r.hora_fin,
            r.fecha,
            r.estado
        FROM reservas r
        WHERE r.id_estudiante = $1
        AND r.fecha = CURRENT_DATE`,
        [id_estudiante]
    )
    return result.rows[0]
}

module.exports = {
    getConfiguracionTurnos,
    getDisponibilidad,
    asignarTurnoAutomatico,
    getTurnosPorFecha,
    getTurnoEstudiante
}