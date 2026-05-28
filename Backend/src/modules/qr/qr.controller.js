const qrService = require('./qr.service')
const { AppError } = require('../../shared/middleware/error.middleware')
const prisma = require('../../config/prisma')

const getIdEstudiante = async (id_usuario) => {
    const usuario = await prisma.usuarios.findUnique({
        where: { id_usuario },
        select: { id_estudiante: true }
    })
    return usuario?.id_estudiante
}

const generarQR = async (req, res, next) => {
    try {
        const { id_reserva } = req.params
        const id_estudiante = await getIdEstudiante(req.usuario.id)
        const qr = await qrService.generarQR(Number(id_reserva), id_estudiante)
        res.json(qr)
    } catch (error) {
        if (error.message === 'RESERVA_NO_ENCONTRADA') return next(new AppError(404, 'Reserva no encontrada'))
        if (error.message === 'YA_ENTREGADA') return next(new AppError(409, 'Esta reserva ya fue entregada'))
        if (error.message === 'RESERVA_CANCELADA') return next(new AppError(409, 'Esta reserva fue cancelada'))
        if (error.message === 'RESERVA_NO_ES_HOY') return next(new AppError(400, 'Solo puedes generar el QR el día de tu reserva'))
        next(error)
    }
}

const escanearQR = async (req, res, next) => {
    try {
        const { codigo_qr } = req.body
        const resultado = await qrService.escanearQR(codigo_qr)
        res.json(resultado)
    } catch (error) {
        if (error.message === 'QR_INVALIDO') return next(new AppError(400, 'QR inválido'))
        if (error.message === 'QR_YA_USADO') return next(new AppError(409, 'Este QR ya fue escaneado'))
        if (error.message === 'QR_EXPIRADO') return next(new AppError(400, 'Este QR ha expirado'))
        if (error.message === 'YA_ENTREGADA') return next(new AppError(409, 'Esta reserva ya fue entregada'))
        next(error)
    }
}

module.exports = { generarQR, escanearQR }
