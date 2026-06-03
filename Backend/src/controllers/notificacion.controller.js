const notificacionService = require('../services/notificacion.service')
const { AppError } = require('../middleware/error.middleware')
const prisma = require('../config/prisma')

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

const getVapidPublicKey = (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY })
}

const suscribirPush = async (req, res, next) => {
    try {
        const id_estudiante = await getIdEstudiante(req.usuario.id)
        await notificacionService.guardarSuscripcion(id_estudiante, req.body)
        res.json({ msg: 'Suscripción guardada' })
    } catch (error) {
        next(error)
    }
}

module.exports = { getNotificaciones, marcarLeida, marcarTodasLeidas, suscribirPush, getVapidPublicKey }
