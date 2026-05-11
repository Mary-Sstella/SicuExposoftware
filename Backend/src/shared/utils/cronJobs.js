const cron = require('node-cron')
const prisma = require('../../config/prisma')

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

        // Si llega a 3 inasistencias desactivar usuario
        if (estudianteActualizado.contador_inasistencias >= 3) {
            await prisma.usuarios.updateMany({
                where: { id_estudiante: reserva.id_estudiante },
                data: { activo: false }
            })

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

// Corre todos los días a las 2pm
const iniciarCronJobs = () => {
    cron.schedule('0 14 * * 1-5', marcarInasistencias, {
        timezone: 'America/Bogota'
    })
    console.log('Cron job iniciado: marcará inasistencias a las 2pm de lunes a viernes')
}

module.exports = { iniciarCronJobs }