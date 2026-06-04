const prisma = require('../config/prisma')

const createReserva = async (data) => {
    // Verificar que la reserva sea para mañana o después
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const fechaReserva = new Date(data.fecha)
    fechaReserva.setHours(0, 0, 0, 0)
    const diferenciaDias = Math.floor((fechaReserva - hoy) / (1000 * 60 * 60 * 24))

    if (diferenciaDias < 1) {
        throw new Error('FECHA_INVALIDA')
    }

    // Verificar cupo en el rango horario seleccionado
    const config = await prisma.configuracion_turnos.findFirst({
        where: {
            id_configuracion: parseInt(data.id_configuracion),
            activo: true
        }
    })

    if (!config) {
        throw new Error('RANGO_NO_ENCONTRADO')
    }

    // Contar reservas existentes para esa fecha y rango
    const ocupados = await prisma.reservas.count({
        where: {
            fecha: new Date(data.fecha),
            hora_inicio: config.hora_inicio
        }
    })

    if (ocupados >= config.capacidad_maxima) {
        throw new Error('SIN_CUPO')
    }

    const numeroTurno = ocupados + 1

    return await prisma.reservas.create({
        data: {
            id_estudiante: parseInt(data.id_estudiante),
            fecha: new Date(data.fecha),
            lunes: data.lunes,
            martes: data.martes,
            miercoles: data.miercoles,
            jueves: data.jueves,
            viernes: data.viernes,
            estado: 'PENDIENTE',
            numero_identificacion: BigInt(data.numero_identificacion),
            nombre_estudiante: data.nombre_estudiante,
            numero_turno: numeroTurno,
            hora_inicio: config.hora_inicio,
            hora_fin: config.hora_fin
        }
    })
}

const getAsistenciaHoy = async () => {
    const diaSemana = new Date().getDay()
    
    // Si es sábado (6) o domingo (0), no hay asistencia
    if (diaSemana === 0 || diaSemana === 6) {
        return []
    }

    const campos = ['', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes']
    const campo = campos[diaSemana]
    
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const reservas = await prisma.reservas.findMany({
        where: {
            fecha: hoy,
            [campo]: true,
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
            { hora_inicio: 'asc' },
            { numero_turno: 'asc' }
        ]
    })

    const vistos = new Set()
    return reservas
    .filter(r => {
        if (vistos.has(r.id_estudiante)) return false
        vistos.add(r.id_estudiante)
        return true
    })
    .map(r => ({
        hora_reserva: r.hora_inicio,
        nombres: r.estudiante.nombres,
        apellidos: r.estudiante.apellidos,
        numero_identificacion: r.estudiante.numero_identificacion?.toString(),
        carrera: r.estudiante.programa,
        turno: r.numero_turno,
        metodo: r.metodo,
        estado: r.estado
    }))

}

module.exports = { createReserva, getAsistenciaHoy }