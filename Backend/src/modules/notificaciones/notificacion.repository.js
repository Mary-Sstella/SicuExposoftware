const prisma = require('../../config/prisma')

const crearNotificacion = (data) => {
    return prisma.notificaciones.create({ data })
}

const getNotificacionesEstudiante = (id_estudiante) => {
    return prisma.notificaciones.findMany({
        where: { id_estudiante },
        orderBy: { fecha_creacion: 'desc' },
        take: 50,
    })
}

const getNoLeidas = (id_estudiante) => {
    return prisma.notificaciones.count({
        where: { id_estudiante, leida: false },
    })
}

const marcarLeida = (id_notificacion) => {
    return prisma.notificaciones.update({
        where: { id_notificacion },
        data: { leida: true },
    })
}

const marcarTodasLeidas = (id_estudiante) => {
    return prisma.notificaciones.updateMany({
        where: { id_estudiante, leida: false },
        data: { leida: true },
    })
}

module.exports = {
    crearNotificacion,
    getNotificacionesEstudiante,
    getNoLeidas,
    marcarLeida,
    marcarTodasLeidas,
}
