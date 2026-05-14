const prisma = require('../../config/prisma')

const getEstudiantesPorCarrera = async (req, res, next) => {
    try {
        const result = await prisma.estudiante.groupBy({
            by: ['programa'],
            _count: { id_estudiante: true },
            orderBy: { _count: { id_estudiante: 'desc' } }
        })

        res.json(result.map(r => ({
            carrera: r.programa,
            total: r._count.id_estudiante
        })))
    } catch (error) {
        next(error)
    }
}

const getAsistenciaMensual = async (req, res, next) => {
    try {
        const hoy = new Date()
        const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59)

        const reservasMes = await prisma.reservas.findMany({
            where: {
                fecha: { gte: primerDiaMes, lte: ultimoDiaMes }
            }
        })

        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
        const campos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']

        res.json(dias.map((dia, i) => ({
            dia,
            presentes: reservasMes.filter(r => r[campos[i]] && r.estado === 'ENTREGADA').length,
            ausentes: reservasMes.filter(r => r[campos[i]] && r.estado !== 'ENTREGADA').length
        })))
    } catch (error) {
        next(error)
    }
}

const getRangosPopulares = async (req, res, next) => {
    try {
        const rangos = await prisma.configuracion_turnos.findMany({
            where: { activo: true },
            orderBy: { hora_inicio: 'asc' }
        })

        const resultado = await Promise.all(rangos.map(async (rango) => {
            const total = await prisma.reservas.count({
                where: { hora_inicio: rango.hora_inicio }
            })

            return {
                hora_inicio: rango.hora_inicio,
                hora_fin: rango.hora_fin,
                capacidad_maxima: rango.capacidad_maxima,
                total_reservas: total
            }
        }))

        resultado.sort((a, b) => b.total_reservas - a.total_reservas)

        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

module.exports = { getEstudiantesPorCarrera, getAsistenciaMensual, getRangosPopulares }