const reservaRepository = require('./reserva.repository')

const createReserva = async (data) => {
    return await reservaRepository.createReserva(data)
}

const getAsistenciaHoy = async () => {
    return await reservaRepository.getAsistenciaHoy()
}

module.exports = { createReserva, getAsistenciaHoy }