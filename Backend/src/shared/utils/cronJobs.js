const cron = require('node-cron')
const pool = require('../../config/db')

const marcarInasistencias = async () => {
    console.log('Ejecutando cron job: marcando inasistencias...')

    const diaSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][new Date().getDay()]

    // Obtener reservas pendientes del día actual
    const reservasPendientes = await pool.query(
        `SELECT r.*, e.id_estudiante, e.contador_inasistencias
        FROM reservas r
        JOIN estudiante e ON r.id_estudiante = e.id_estudiante
        WHERE r.fecha = CURRENT_DATE
        AND r.${diaSemana} = true
        AND r.estado = 'PENDIENTE'`
    )

    for (const reserva of reservasPendientes.rows) {
        // Cancelar la reserva
        await pool.query(
            `UPDATE reservas SET estado = 'CANCELADA' WHERE id_reserva = $1`,
            [reserva.id_reserva]
        )

        // Incrementar contador de inasistencias
        const resultado = await pool.query(
            `UPDATE estudiante SET contador_inasistencias = contador_inasistencias + 1
            WHERE id_estudiante = $1
            RETURNING contador_inasistencias`,
            [reserva.id_estudiante]
        )

        const nuevoContador = resultado.rows[0].contador_inasistencias

        // Si llega a 3 inasistencias desactivar usuario
        if (nuevoContador >= 3) {
            await pool.query(
                `UPDATE usuarios SET activo = false
                WHERE id_estudiante = $1`,
                [reserva.id_estudiante]
            )

            await pool.query(
                `INSERT INTO actividades (tipo, descripcion, id_usuario)
                VALUES ($1, $2, $3)`,
                ['USUARIO_DESACTIVADO', `Usuario desactivado por 3 inasistencias: ${reserva.nombre_estudiante}`, null]
            )

            console.log(`Usuario desactivado: ${reserva.nombre_estudiante}`)
        }

        await pool.query(
            `INSERT INTO actividades (tipo, descripcion, id_usuario)
            VALUES ($1, $2, $3)`,
            ['INASISTENCIA_REGISTRADA', `Inasistencia registrada para: ${reserva.nombre_estudiante}`, null]
        )
    }

    console.log(`Inasistencias procesadas: ${reservasPendientes.rows.length}`)
}

// Corre todos los días a las 2pm
const iniciarCronJobs = () => {
    cron.schedule('0 14 * * 1-5', marcarInasistencias, {
        timezone: 'America/Bogota'
    })
    console.log('Cron job iniciado: marcará inasistencias a las 2pm de lunes a viernes')
}

module.exports = { iniciarCronJobs }