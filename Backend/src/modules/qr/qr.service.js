const qrRepository = require('./qr.repository')
const jwt = require('jsonwebtoken')
const prisma = require('../../config/prisma')

const generarQR = async (id_reserva, id_estudiante) => {
    const reserva = await prisma.reservas.findUnique({ where: { id_reserva } })

    if (!reserva) throw new Error('RESERVA_NO_ENCONTRADA')
    if (reserva.estado === 'ENTREGADA') throw new Error('YA_ENTREGADA')
    if (reserva.estado === 'CANCELADA') throw new Error('RESERVA_CANCELADA')

    const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' })
    const fechaReserva = reserva.fecha instanceof Date
        ? reserva.fecha.toISOString().split('T')[0]
        : String(reserva.fecha).split('T')[0]
    if (fechaReserva !== hoy) throw new Error('RESERVA_NO_ES_HOY')

    const expiracion = new Date(`${hoy}T23:59:59-05:00`)

    const qrExistente = await qrRepository.getQRPorReserva(id_reserva)
    if (qrExistente && !qrExistente.usado && qrExistente.valido_hasta > new Date()) {
        return qrExistente
    }

    const token = jwt.sign(
        { id_reserva, id_estudiante, fecha: hoy },
        process.env.JWT_SECRET,
        { expiresIn: Math.floor((expiracion - Date.now()) / 1000) }
    )

    return await qrRepository.crearQR({
        id_reserva,
        id_estudiante,
        codigo_qr: token,
        url_qr: token,
        fecha_generacion: new Date(),
        valido_hasta: expiracion,
        usado: false
    })
}

const escanearQR = async (codigo_qr) => {
    const qr = await qrRepository.getQRPorCodigo(codigo_qr)

    if (!qr) throw new Error('QR_INVALIDO')
    if (qr.usado) throw new Error('QR_YA_USADO')
    if (qr.valido_hasta < new Date()) throw new Error('QR_EXPIRADO')

    let payload
    try {
        payload = jwt.verify(codigo_qr, process.env.JWT_SECRET)
    } catch {
        throw new Error('QR_INVALIDO')
    }

    const reserva = await prisma.reservas.findUnique({
        where: { id_reserva: payload.id_reserva },
        include: {
            estudiante: {
                select: {
                    nombres: true,
                    apellidos: true,
                    numero_identificacion: true,
                    programa: true
                }
            }
        }
    })

    if (reserva.estado === 'ENTREGADA') throw new Error('YA_ENTREGADA')

    await prisma.reservas.update({
        where: { id_reserva: payload.id_reserva },
        data: { estado: 'ENTREGADA', metodo: 'QR' }
    })

    await qrRepository.marcarUsado(qr.id_qr)

    return {
        nombres: reserva.estudiante.nombres,
        apellidos: reserva.estudiante.apellidos,
        numero_identificacion: reserva.estudiante.numero_identificacion.toString(),
        programa: reserva.estudiante.programa,
        numero_turno: reserva.numero_turno,
        hora_inicio: reserva.hora_inicio,
        hora_fin: reserva.hora_fin
    }
}

module.exports = { generarQR, escanearQR }