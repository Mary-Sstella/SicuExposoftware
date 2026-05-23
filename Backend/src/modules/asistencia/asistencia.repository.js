const prisma = require('../../config/prisma')

// Registrar asistencia cambiando estado de reserva a ENTREGADA
const registrarAsistencia = async (numero_identificacion) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const diaSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][new Date().getDay()]

    // Buscar estudiante por número de identificación
    const estudiante = await prisma.estudiante.findUnique({
        where: { numero_identificacion: BigInt(numero_identificacion) }
    })

    if (!estudiante) {
        throw new Error('SIN_RESERVA')
    }

    // Buscar reserva real del estudiante para hoy (con turno asignado)
    const reserva = await prisma.reservas.findFirst({
        where: {
            id_estudiante: estudiante.id_estudiante,
            fecha: hoy,
            [diaSemana]: true,
            numero_turno: { not: null }
        }
    })

    if (!reserva) {
        throw new Error('SIN_RESERVA')
    }

    if (reserva.estado === 'ENTREGADA') {
        throw new Error('YA_REGISTRADA')
    }

    // Cambiar estado a ENTREGADA
    return await prisma.reservas.update({
        where: { id_reserva: reserva.id_reserva },
        data: { estado: 'ENTREGADA' }
    })
}

// Obtener asistencias por fecha
const getAsistenciasPorFecha = async (fecha) => {
    return await prisma.reservas.findMany({
        where: {
            fecha: new Date(fecha),
            numero_turno: { not: null }
        },
        include: {
            estudiante: {
                select: {
                    nombres: true,
                    apellidos: true,
                    numero_identificacion: true,
                    programa: true
                }
            }
        },
        orderBy: [
            { numero_turno: 'asc' }
        ]
    })
}

module.exports = { registrarAsistencia, getAsistenciasPorFecha }