const prisma = require('../../config/prisma')

const crearQR = async (data) => {
    return await prisma.qr_generados.create({ data })
}

const getQRPorReserva = async (id_reserva) => {
    return await prisma.qr_generados.findFirst({
        where: { id_reserva },
        orderBy: { fecha_generacion: 'desc' }
    })
}

const getQRPorCodigo = async (codigo_qr) => {
    return await prisma.qr_generados.findFirst({
        where: { codigo_qr }
    })
}

const marcarUsado = async (id_qr) => {
    return await prisma.qr_generados.update({
        where: { id_qr },
        data: { usado: true }
    })
}

module.exports = { crearQR, getQRPorReserva, getQRPorCodigo, marcarUsado }
