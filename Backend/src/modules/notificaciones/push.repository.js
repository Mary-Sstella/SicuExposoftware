const prisma = require('../../config/prisma')

const guardarSuscripcion = (id_estudiante, endpoint, p256dh, auth) => {
    return prisma.push_suscripciones.upsert({
        where: { id_estudiante_endpoint: { id_estudiante, endpoint } },
        update: { p256dh, auth },
        create: { id_estudiante, endpoint, p256dh, auth },
    })
}

const getSuscripcionesEstudiante = (id_estudiante) => {
    return prisma.push_suscripciones.findMany({
        where: { id_estudiante },
    })
}

const eliminarSuscripcion = (endpoint) => {
    return prisma.push_suscripciones.delete({
        where: { endpoint },
    })
}

module.exports = {
    guardarSuscripcion,
    getSuscripcionesEstudiante,
    eliminarSuscripcion,
}
