const prisma = require('../../config/prisma')
const { AppError } = require('../../shared/middleware/error.middleware')

const getSummary = async (req, res, next) => {
    try {
        const totalEstudiantes = await prisma.estudiante.count()

        const estudiantesActivos = await prisma.estudiante.count({
            where: { estado: 'ACTIVO' }
        })

        const estudiantesInactivos = await prisma.estudiante.count({
            where: { estado: 'INACTIVO' }
        })

        const pagosPendientes = await prisma.cartera.count({
            where: { estado: 'PENDIENTE' }
        })

        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        const asistenciasHoy = await prisma.reservas.count({
            where: {
                estado: 'ENTREGADA',
                fecha: hoy
            }
        })

        res.json({
            total_estudiantes: totalEstudiantes,
            estudiantes_activos: estudiantesActivos,
            estudiantes_inactivos: estudiantesInactivos,
            pagos_pendientes: pagosPendientes,
            asistencias_hoy: asistenciasHoy
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