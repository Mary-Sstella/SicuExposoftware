const pool = require('../../config/db')

const asignarTurnos = async (fecha) => {
    // Obtener todas las reservas del día
    const reservas = await pool.query(
        `SELECT id_reserva FROM reservas
        WHERE fecha = $1
        ORDER BY id_reserva ASC`,
        [fecha]
    )

    const total = reservas.rows.length

    if (total === 0) {
        throw new Error('SIN_RESERVAS')
    }

    // Dividir en 3 grupos
    const porGrupo = Math.ceil(total / 3)

    const horarios = [
        { inicio: '11:00', fin: '12:00' },
        { inicio: '12:00', fin: '13:00' },
        { inicio: '13:00', fin: '14:00' }
    ]

    for (let i = 0; i < reservas.rows.length; i++) {
        const grupoIndex = Math.min(Math.floor(i / porGrupo), 2)
        const horario = horarios[grupoIndex]
        const numeroTurno = i + 1

        await pool.query(
            `UPDATE reservas SET
                numero_turno = $1,
                hora_inicio = $2,
                hora_fin = $3
            WHERE id_reserva = $4`,
            [numeroTurno, horario.inicio, horario.fin, reservas.rows[i].id_reserva]
        )
    }

    return { total, mensaje: `${total} turnos asignados correctamente` }
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
        ORDER BY r.numero_turno ASC`,
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

module.exports = { asignarTurnos, getTurnosPorFecha, getTurnoEstudiante }