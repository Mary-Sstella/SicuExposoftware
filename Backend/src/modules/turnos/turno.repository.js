const prisma = require('../../config/prisma')

// Obtener configuración de rangos horarios
const getConfiguracionTurnos = async () => {
    return await prisma.configuracion_turnos.findMany({
        orderBy: { hora_inicio: 'asc' }
    })
}

// Obtener disponibilidad por fecha
const getDisponibilidad = async (fecha) => {
    const configuracion = await prisma.configuracion_turnos.findMany({
        where: { activo: true },
        orderBy: { hora_inicio: 'asc' }
    })

    const disponibilidad = []

    for (const rango of configuracion) {
        const ocupados = await prisma.reservas.count({
            where: {
                fecha: new Date(fecha),
                hora_inicio: rango.hora_inicio
            }
        })

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

// Obtener turnos por fecha con búsqueda opcional
const getTurnosPorFecha = async (fecha, buscar) => {
    const where = {
        fecha: new Date(fecha)
    }

    return await prisma.reservas.findMany({
        where,
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
    }).then(reservas => {
        if (buscar) {
            const buscarLower = buscar.toLowerCase()
            return reservas.filter(r =>
                r.estudiante.nombres?.toLowerCase().includes(buscarLower) ||
                r.estudiante.apellidos?.toLowerCase().includes(buscarLower) ||
                r.estudiante.numero_identificacion?.toString().includes(buscar)
            )
        }
        return reservas
    })
}

// Obtener turno del estudiante para hoy
const getTurnoEstudiante = async (id_estudiante) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    return await prisma.reservas.findFirst({
        where: {
            id_estudiante: parseInt(id_estudiante),
            fecha: hoy
        },
        select: {
            numero_turno: true,
            hora_inicio: true,
            hora_fin: true,
            fecha: true,
            estado: true
        }
    })
}

// Actualizar configuración de turno
const updateConfiguracion = async (id, data) => {
    const config = await prisma.configuracion_turnos.update({
        where: { id_configuracion: parseInt(id) },
        data: {
            capacidad_maxima: data.capacidad_maxima,
            activo: data.activo
        }
    })

    if (!config) {
        throw new Error('RANGO_NO_ENCONTRADO')
    }

    return config
}

module.exports = {
    getConfiguracionTurnos,
    getDisponibilidad,
    asignarTurnoAutomatico: async () => {},
    getTurnosPorFecha,
    getTurnoEstudiante,
    updateConfiguracion
}