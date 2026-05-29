const notificacionService = require('./notificacion.service')
const { AppError } = require('../../shared/middleware/error.middleware')
const prisma = require('../../config/prisma')

const getIdEstudiante = async (id_usuario) => {
    const usuario = await prisma.usuarios.findUnique({
        where: { id_usuario },
        select: { id_estudiante: true },
    })
    return usuario?.id_estudiante
}

const getNotificaciones = async (req, res, next) => {
    try {
        const id_estudiante = await getIdEstudiante(req.usuario.id)
        const resultado = await notificacionService.getNotificaciones(id_estudiante)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

const marcarLeida = async (req, res, next) => {
    try {
        const { id_notificacion } = req.params
        const resultado = await notificacionService.marcarLeida(Number(id_notificacion))
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

const marcarTodasLeidas = async (req, res, next) => {
    try {
        const id_estudiante = await getIdEstudiante(req.usuario.id)
        await notificacionService.marcarTodasLeidas(id_estudiante)
        res.json({ msg: 'Notificaciones marcadas como leídas' })
    } catch (error) {
        next(error)
    }
}

module.exports = { getNotificaciones, marcarLeida, marcarTodasLeidas }
