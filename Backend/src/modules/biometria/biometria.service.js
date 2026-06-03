const biometriaRepository = require('./biometria.repository')

const validarHuella = async (finger_id) => {
    console.log('🔍 Buscando huella:', finger_id)
    const huella = await biometriaRepository.getHuellaConEstudiante(finger_id)
    console.log('🔍 Huella encontrada:', JSON.stringify(huella))

    if (!huella) {
        return { success: false, mensaje: 'Huella no registrada' }
    }

    const { id_estudiante, nombres, apellidos } = huella.estudiante
    const nombre = `${nombres} ${apellidos}`

    const yaEntregado = await biometriaRepository.getDetalleHoy(id_estudiante, 'ENTREGADA')
    console.log('🔍 Ya entregado:', JSON.stringify(yaEntregado))

    if (yaEntregado) {
        return {
            success: false,
            mensaje: 'Almuerzo ya fue entregado hoy',
            estudiante: { id: id_estudiante, nombre },
        }
    }

    const almuerzoPendiente = await biometriaRepository.getDetalleHoy(id_estudiante, 'PENDIENTE')
    console.log('🔍 Almuerzo pendiente:', JSON.stringify(almuerzoPendiente))

    if (!almuerzoPendiente) {
        return {
            success: false,
            mensaje: 'No tiene almuerzo asignado para hoy',
            estudiante: { id: id_estudiante, nombre },
        }
    }

    await biometriaRepository.marcarEntregado(almuerzoPendiente.id_reserva)
    console.log('✅ Marcado como entregado')

    return {
        success: true,
        mensaje: 'Almuerzo autorizado',
        estudiante: { id: id_estudiante, nombre },
    }
}

const registrarHuella = (id_estudiante, finger_id) => {
    return biometriaRepository.registrarHuella(id_estudiante, finger_id)
}

const getEstudiantePorCedula = async (cedula) => {
    const est = await biometriaRepository.getEstudiantePorCedula(cedula)
    if (!est) return null
    return {
        id_estudiante: est.id_estudiante,
        nombres: est.nombres,
        apellidos: est.apellidos,
        numero_identificacion: est.numero_identificacion?.toString(),
        programa: est.programa,
        finger_id: est.huellas[0]?.finger_id ?? null
    }
}

module.exports = { validarHuella, registrarHuella, getEstudiantePorCedula }