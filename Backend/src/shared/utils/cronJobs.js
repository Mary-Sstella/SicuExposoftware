const cron = require('node-cron')
const prisma = require('../../config/prisma')
const { enviarNotificacion } = require('../../modules/notificaciones/notificacion.service')

const marcarInasistencias = async () => {
    console.log('Ejecutando cron job: marcando inasistencias...')

    const diaSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][new Date().getDay()]
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    // Obtener reservas pendientes del día actual
    const reservasPendientes = await prisma.reservas.findMany({
        where: {
            fecha: hoy,
            [diaSemana]: true,
            estado: 'PENDIENTE'
        },
        include: {
            estudiante: true
        }
    })

    for (const reserva of reservasPendientes) {
        // Cancelar la reserva
        await prisma.reservas.update({
            where: { id_reserva: reserva.id_reserva },
            data: { estado: 'CANCELADA' }
        })

        // Incrementar contador de inasistencias
        const estudianteActualizado = await prisma.estudiante.update({
            where: { id_estudiante: reserva.id_estudiante },
            data: { contador_inasistencias: { increment: 1 } }
        })

        const contador_actualizado = estudianteActualizado.contador_inasistencias
        const limite_inasistencias = 3

        enviarNotificacion(
            reserva.id_estudiante,
            'ASISTENCIA_MARCADA',
            '⚠️ Inasistencia registrada',
            `Se registró una inasistencia en tu cuenta. Llevas ${contador_actualizado} de ${limite_inasistencias} faltas permitidas.`
        )

        if (contador_actualizado === limite_inasistencias - 1) {
            enviarNotificacion(
                reserva.id_estudiante,
                'PROXIMAS_FALLAS',
                '🚨 Atención: estás próximo al límite de faltas',
                `Llevas ${contador_actualizado} faltas. Si acumulas una más perderás el beneficio del comedor.`
            )
        }

        // Si llega a 3 inasistencias desactivar usuario
        if (contador_actualizado >= limite_inasistencias) {
            await prisma.usuarios.updateMany({
                where: { id_estudiante: reserva.id_estudiante },
                data: { activo: false }
            })

            enviarNotificacion(
                reserva.id_estudiante,
                'CUENTA_INACTIVADA',
                '🔒 Cuenta inactivada',
                'Tu cuenta ha sido inactivada por acumular 3 inasistencias. Podrás volver a inscribirte en el próximo semestre.'
            )

            await prisma.actividades.create({
                data: {
                    tipo: 'USUARIO_DESACTIVADO',
                    descripcion: `Usuario desactivado por 3 inasistencias: ${reserva.nombre_estudiante}`,
                    id_usuario: null
                }
            })

            console.log(`Usuario desactivado: ${reserva.nombre_estudiante}`)
        }

        await prisma.actividades.create({
            data: {
                tipo: 'INASISTENCIA_REGISTRADA',
                descripcion: `Inasistencia registrada para: ${reserva.nombre_estudiante}`,
                id_usuario: null
            }
        })
    }

    console.log(`Inasistencias procesadas: ${reservasPendientes.length}`)
}

const recordatorioTurnos = async () => {
    const ahora = new Date()
    const ahoraCol = new Date(ahora.toLocaleString('en-US', { timeZone: 'America/Bogota' }))
    const horaActual = ahoraCol.getHours().toString().padStart(2, '0') + ':' + ahoraCol.getMinutes().toString().padStart(2, '0')

    const en15 = new Date(ahoraCol.getTime() + 15 * 60 * 1000)
    const horaEn15 = en15.getHours().toString().padStart(2, '0') + ':' + en15.getMinutes().toString().padStart(2, '0')

    const fechaHoy = ahoraCol.toLocaleDateString('en-CA')

    const reservas = await prisma.reservas.findMany({
        where: {
            hora_inicio: horaEn15,
            estado: 'PENDIENTE',
        },
    })

    const reservasHoy = reservas.filter(r => {
        const fechaReserva = new Date(r.fecha).toLocaleDateString('en-CA', { timeZone: 'America/Bogota' })
        return fechaReserva === fechaHoy
    })

    reservasHoy.forEach(reserva => {
        enviarNotificacion(
            reserva.id_estudiante,
            'RECORDATORIO_TURNO',
            '🍽️ Tu almuerzo es pronto',
            `Tu turno de almuerzo comienza a las ${horaEn15}. ¡No olvides presentar tu QR!`
        )
    })

    if (reservasHoy.length > 0) {
        console.log(`Recordatorios de turno enviados: ${reservasHoy.length}`)
    }
}

// Corre todos los días a las 2pm
const iniciarCronJobs = () => {
    cron.schedule('0 14 * * 1-5', marcarInasistencias, {
        timezone: 'America/Bogota'
    })
    console.log('Cron job iniciado: marcará inasistencias a las 2pm de lunes a viernes')

    cron.schedule('* * * * 1-5', recordatorioTurnos, {
        timezone: 'America/Bogota'
    })
    console.log('Cron job iniciado: recordatorio de turnos cada minuto')
}

module.exports = { iniciarCronJobs }