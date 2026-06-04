const prisma = require('../config/prisma')

// Rangos horarios configurados por el admin
const getConfiguracionTurnos = async () => {
    return await prisma.configuracion_turnos.findMany({
        orderBy: { hora_inicio: 'asc' }
    })
}

// Rangos activos de una fecha con cupos ocupados y disponibles
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
                hora_inicio: rango.hora_inicio,
                numero_turno: { not: null }
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

// Reservas reales de un día para el panel del admin, con búsqueda opcional por nombre o cédula
const getTurnosPorFecha = async (fecha, buscar) => {
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

// Turno del estudiante para hoy (null si no tiene)
const getTurnoEstudiante = async (id_estudiante) => {
    const hoyColombia = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' })
    const fechaInicio = new Date(hoyColombia + 'T00:00:00.000Z')
    const fechaFin = new Date(hoyColombia + 'T23:59:59.999Z')

    return await prisma.reservas.findFirst({
        where: {
            id_estudiante: parseInt(id_estudiante),
            fecha: { gte: fechaInicio, lte: fechaFin },
            numero_turno: { not: null }
        },
        select: {
            id_reserva: true,  
            numero_turno: true,
            hora_inicio: true,
            hora_fin: true,
            fecha: true,
            estado: true
        }
    })
}

// Próxima reserva futura del estudiante (para impedir que cree dos a la vez)
const getReservaActiva = async (id_estudiante) => {
    const manana = new Date()
    manana.setDate(manana.getDate() + 1)
    manana.setHours(0, 0, 0, 0)

    return await prisma.reservas.findFirst({
        where: {
            id_estudiante: parseInt(id_estudiante),
            fecha: { gte: manana },
            numero_turno: { not: null }
        },
        select: {
            id_reserva: true,
            fecha: true,
            hora_inicio: true,
            hora_fin: true,
            numero_turno: true,
            estado: true
        }
    })
}

// Valida y crea una reserva asignando número de turno por orden de llegada en el rango
const asignarTurnoAutomatico = async (id_estudiante, fecha, id_configuracion) => {
    const config = await prisma.configuracion_turnos.findUnique({
        where: { id_configuracion: parseInt(id_configuracion) }
    })

    if (!config || !config.activo) throw new Error('RANGO_NO_DISPONIBLE')

    // Parsear como fecha local para evitar desfase UTC-5
    const [y, m, d] = fecha.split('-').map(Number)
    const fechaReserva = new Date(y, m - 1, d)
    fechaReserva.setHours(0, 0, 0, 0)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    if (fechaReserva <= hoy) throw new Error('FECHA_INVALIDA')

    const diasMap = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
    const diaSemana = diasMap[fechaReserva.getDay()]

    const horario = await prisma.reservas.findFirst({
        where: { id_estudiante: parseInt(id_estudiante) },
        select: { lunes: true, martes: true, miercoles: true, jueves: true, viernes: true }
    })

    if (!horario || !horario[diaSemana]) throw new Error('DIA_NO_HABILITADO')

    const reservaActiva = await getReservaActiva(id_estudiante)
    if (reservaActiva) throw new Error('YA_TIENE_RESERVA')

    // Verificar pago aprobado que cubra ese día y tenga almuerzos disponibles
    const pagosAprobados = await prisma.pagos.findMany({
        where: { id_estudiante: parseInt(id_estudiante), estado: 'APROBADO' }
    })

    const pagoValido = pagosAprobados.find(p => {
        const dias = Array.isArray(p.dias_pagados) ? p.dias_pagados : JSON.parse(p.dias_pagados)
        if (!dias.includes(diaSemana)) return false
        if (p.almuerzos_usados >= p.cantidad_almuerzos) return false

        const aprobado = new Date(p.fecha_revision)

        if (p.tipo_periodo === 'SEMANAL') {
            return true
         }


        if (p.tipo_periodo === 'MENSUAL') {
            return aprobado.getMonth() === fechaReserva.getMonth() &&
                   aprobado.getFullYear() === fechaReserva.getFullYear()
        }

        return false
    })

    if (!pagoValido) throw new Error('SIN_PAGO_PARA_DIA')

    const estudiante = await prisma.estudiante.findUnique({
        where: { id_estudiante: parseInt(id_estudiante) },
        select: { numero_identificacion: true, nombres: true, apellidos: true }
    })

    // Crear reserva y descontar un almuerzo del pago
    return await prisma.$transaction(async (tx) => {
        const ocupadosRango = await tx.reservas.count({
            where: {
                fecha: fechaReserva,
                hora_inicio: config.hora_inicio,
                numero_turno: { not: null }
            }
        })

        if (ocupadosRango >= config.capacidad_maxima) throw new Error('SIN_CAPACIDAD')

        const ocupadosDia = await tx.reservas.count({
            where: {
                fecha: fechaReserva,
                numero_turno: { not: null }
            }
        })

        const nuevaReserva = await tx.reservas.create({
            data: {
                id_estudiante: parseInt(id_estudiante),
                fecha: fechaReserva,
                hora_inicio: config.hora_inicio,
                hora_fin: config.hora_fin,
                lunes: diaSemana === 'lunes',
                martes: diaSemana === 'martes',
                miercoles: diaSemana === 'miercoles',
                jueves: diaSemana === 'jueves',
                viernes: diaSemana === 'viernes',
                numero_turno: ocupadosDia + 1,
                estado: 'PENDIENTE',
                numero_identificacion: estudiante?.numero_identificacion,
                nombre_estudiante: `${estudiante?.nombres} ${estudiante?.apellidos}`
            }
        })

        await tx.pagos.update({
            where: { id_pago: pagoValido.id_pago },
            data: { almuerzos_usados: { increment: 1 } }
        })

        return nuevaReserva
    })
}

// Actualiza capacidad o estado activo de un rango horario
const updateConfiguracion = async (id, data) => {
    const config = await prisma.configuracion_turnos.update({
        where: { id_configuracion: parseInt(id) },
        data: {
            capacidad_maxima: data.capacidad_maxima,
            activo: data.activo
        }
    })

    if (!config) throw new Error('RANGO_NO_ENCONTRADO')

    return config
}

// Días de la semana habilitados para el estudiante
const getDiasEstudiante = async (id_estudiante) => {
    return await prisma.reservas.findFirst({
        where: { id_estudiante: parseInt(id_estudiante) },
        select: { lunes: true, martes: true, miercoles: true, jueves: true, viernes: true }
    })
}


// Historial de reservas pasadas del estudiante
const getHistorialEstudiante = async (id_estudiante) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    return await prisma.reservas.findMany({
        where: {
            id_estudiante: parseInt(id_estudiante),
            fecha: { lte: hoy },
            OR: [
                { numero_turno: { not: null } },
                { estado: 'CANCELADA' }
            ]
        },

        select: {
            fecha: true,
            hora_inicio: true,
            hora_fin: true,
            numero_turno: true,
            estado: true
        },
        orderBy: { fecha: 'desc' },
        take: 10
    })
}

const getFechasPagadas = async (id_estudiante) => {
    const pagos = await prisma.pagos.findMany({
        where: { id_estudiante: parseInt(id_estudiante), estado: 'APROBADO' },
        select: { tipo_periodo: true, fecha_revision: true, dias_pagados: true, cantidad_almuerzos: true, almuerzos_usados: true }
    })

    const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
    const fechas = []

    for (const pago of pagos) {
        if (!pago.fecha_revision) continue
        const dias = Array.isArray(pago.dias_pagados) ? pago.dias_pagados : JSON.parse(pago.dias_pagados)
        const aprobado = new Date(pago.fecha_revision)

        if (pago.tipo_periodo === 'SEMANAL') {
            const hoy = new Date()
            hoy.setHours(0, 0, 0, 0)
            const restantes = pago.cantidad_almuerzos - pago.almuerzos_usados
            let count = 0
            const cur = new Date(hoy)
            for (let i = 0; i < 60 && count < restantes; i++) {
                const nombreDia = DIAS_SEMANA[cur.getDay()]
                if (dias.includes(nombreDia)) {
                    const y = cur.getFullYear()
                    const m = String(cur.getMonth() + 1).padStart(2, '0')
                    const d = String(cur.getDate()).padStart(2, '0')
                    fechas.push(`${y}-${m}-${d}`)
                    count++
                }
                cur.setDate(cur.getDate() + 1)
            }
        } else if (pago.tipo_periodo === 'MENSUAL') {
            const inicio = new Date(aprobado.getFullYear(), aprobado.getMonth(), 1)
            const fin = new Date(aprobado.getFullYear(), aprobado.getMonth() + 1, 0)
            fin.setHours(23, 59, 59, 999)
            const current = new Date(inicio)
            while (current <= fin) {
                const nombreDia = DIAS_SEMANA[current.getDay()]
                if (dias.includes(nombreDia)) {
                    const y = current.getFullYear()
                    const m = String(current.getMonth() + 1).padStart(2, '0')
                    const d = String(current.getDate()).padStart(2, '0')
                    fechas.push(`${y}-${m}-${d}`)
                }
                current.setDate(current.getDate() + 1)
            }
        }
    }

    return fechas
}

const getEstudianteStats = async (id_estudiante) => {
    const [inasistencias, pagos, almuerzos_consumidos] = await Promise.all([
        prisma.reservas.count({
            where: { id_estudiante: parseInt(id_estudiante), numero_turno: { not: null }, estado: 'CANCELADA' }
        }),
        prisma.pagos.findMany({
            where: { id_estudiante: parseInt(id_estudiante) },
            select: { estado: true }
        }),
        prisma.reservas.count({
            where: { id_estudiante: parseInt(id_estudiante), estado: 'ENTREGADA' }
        })
    ])
    const pagos_aprobados = pagos.filter(p => p.estado === 'APROBADO').length
    const pagos_rechazados = pagos.filter(p => p.estado === 'RECHAZADO').length
    return { inasistencias, almuerzos_consumidos, pagos_aprobados, pagos_rechazados }
}

const getTurneroActual = async () => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const pendientes = await prisma.reservas.findMany({
        where: {
            fecha: hoy,
            numero_turno: { not: null },
            estado: 'PENDIENTE'
        },
        orderBy: { numero_turno: 'asc' },
        take: 2,
        select: {
            numero_turno: true,
            nombre_estudiante: true,
            hora_inicio: true,
            hora_fin: true
        }
    })

    return {
        turno_actual: pendientes[0] || null,
        siguiente: pendientes[1] || null
    }
}

const cancelarReserva = async (id_reserva, id_estudiante) => {
    const reserva = await prisma.reservas.findFirst({
        where: { id_reserva: parseInt(id_reserva), id_estudiante: parseInt(id_estudiante) }
    })

    if (!reserva) throw new Error('RESERVA_NO_ENCONTRADA')
    if (reserva.estado === 'CANCELADA') throw new Error('YA_CANCELADA')

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const fechaReserva = new Date(reserva.fecha)
    fechaReserva.setHours(0, 0, 0, 0)
    if (fechaReserva <= hoy) throw new Error('NO_CANCELABLE')

    const turnoAnterior = reserva.numero_turno

    return await prisma.$transaction(async (tx) => {
        await tx.reservas.update({
            where: { id_reserva: parseInt(id_reserva) },
            data: { estado: 'CANCELADA', numero_turno: null }
        })

        if (turnoAnterior !== null) {
            const afectadas = await tx.reservas.findMany({
                where: {
                    fecha: reserva.fecha,
                    hora_inicio: reserva.hora_inicio,
                    numero_turno: { gt: turnoAnterior }
                },
                select: { id_reserva: true, numero_turno: true }
            })
            for (const r of afectadas) {
                await tx.reservas.update({
                    where: { id_reserva: r.id_reserva },
                    data: { numero_turno: r.numero_turno - 1 }
                })
            }
        }
    })
}




module.exports = {
    getConfiguracionTurnos,
    getDisponibilidad,
    cancelarReserva,
    asignarTurnoAutomatico,
    getTurnosPorFecha,
    getTurnoEstudiante,
    getReservaActiva,
    updateConfiguracion,
    getDiasEstudiante,
    getHistorialEstudiante,
    getFechasPagadas,
    getEstudianteStats,
    getTurneroActual
}
