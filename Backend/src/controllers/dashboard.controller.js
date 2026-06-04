const prisma = require('../config/prisma')
const { AppError } = require('../middleware/error.middleware')

const getSummary = async (req, res, next) => {
    try {
        const ahora = new Date()
        const inicioEsteMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
        const inicioMesPasado = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)
        const finMesPasado = new Date(ahora.getFullYear(), ahora.getMonth(), 0, 23, 59, 59, 999)

        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        const ayer = new Date(hoy)
        ayer.setDate(hoy.getDate() - 1)

        const calcPct = (actual, anterior) => {
            if (anterior === 0) return actual > 0 ? 100 : 0
            return Math.round(((actual - anterior) / anterior) * 1000) / 10
        }

        const [
            totalActual,
            totalMesPasado,
            activosActual,
            activosMesPasado,
            pagosPendientes,
            pagosNuevosMes,
            pagosNuevosMesPasado,
            asistenciasHoy,
            asistenciasAyer
        ] = await Promise.all([
            prisma.estudiante.count(),
            prisma.estudiante.count({ where: { fecha_registro: { lt: inicioEsteMes } } }),
            prisma.estudiante.count({ where: { estado: 'ACTIVO' } }),
            prisma.estudiante.count({ where: { estado: 'ACTIVO', fecha_registro: { lt: inicioEsteMes } } }),
            prisma.pagos.count({ where: { estado: 'PENDIENTE' } }),
            prisma.pagos.count({ where: { fecha_subida: { gte: inicioEsteMes } } }),
            prisma.pagos.count({ where: { fecha_subida: { gte: inicioMesPasado, lte: finMesPasado } } }),
            prisma.reservas.count({ where: { estado: 'ENTREGADA', fecha: hoy } }),
            prisma.reservas.count({ where: { estado: 'ENTREGADA', fecha: ayer } })
        ])

        res.json({
            total_estudiantes: totalActual,
            total_estudiantes_change: calcPct(totalActual, totalMesPasado),
            estudiantes_activos: activosActual,
            estudiantes_activos_change: calcPct(activosActual, activosMesPasado),
            estudiantes_inactivos: totalActual - activosActual,
            pagos_pendientes: pagosPendientes,
            pagos_pendientes_change: calcPct(pagosNuevosMes, pagosNuevosMesPasado),
            asistencias_hoy: asistenciasHoy,
            asistencias_hoy_change: calcPct(asistenciasHoy, asistenciasAyer)
        })
    } catch (error) {
        next(error)
    }
}


const getAsistenciaSemanal = async (req, res, next) => {
    try {
        const hoy = new Date()
        const lunes = new Date(hoy)
        lunes.setDate(hoy.getDate() - hoy.getDay() + 1)
        lunes.setHours(0, 0, 0, 0)

        const viernes = new Date(lunes)
        viernes.setDate(lunes.getDate() + 4)
        viernes.setHours(23, 59, 59, 999)

        const reservasSemana = await prisma.reservas.findMany({
            where: {
                fecha: {
                    gte: lunes,
                    lte: viernes
                }
            }
        })

        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
        const campos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']

        const data = dias.map((dia, i) => ({
            dia,
            presentes: reservasSemana.filter(r => r[campos[i]] && r.estado === 'ENTREGADA').length,
            ausentes: reservasSemana.filter(r => r[campos[i]] && r.estado !== 'ENTREGADA').length
        }))

        res.json(data)
    } catch (error) {
        next(error)
    }
}

const getActividadesRecientes = async (req, res, next) => {
    try {
        const actividades = await prisma.actividades.findMany({
            orderBy: { fecha: 'desc' },
            take: 10,
            include: {
                usuarios: {
                    select: { username: true }
                }
            }
        })

        res.json(actividades.map(a => ({
            id_actividad: a.id_actividad,
            tipo: a.tipo,
            descripcion: a.descripcion,
            fecha: a.fecha,
            username: a.usuarios?.username ?? null
        })))
    } catch (error) {
        next(error)
    }
}

module.exports = { getSummary, getAsistenciaSemanal, getActividadesRecientes }