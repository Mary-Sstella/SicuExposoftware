const biometriaRepository = require('../repositories/biometria.repository')

const validarHuella = async (finger_id) => {
    const huella = await biometriaRepository.getHuellaConEstudiante(finger_id)

    if (!huella) {
        return { success: false, mensaje: 'Huella no registrada' }
    }

    const { id_estudiante, nombres, apellidos } = huella.estudiante
    const nombre = `${nombres} ${apellidos}`

    const yaEntregado = await biometriaRepository.getDetalleHoy(id_estudiante, 'ENTREGADO')

    if (yaEntregado) {
        return {
            success: false,
            mensaje: 'Almuerzo ya fue entregado hoy',
            estudiante: { id: id_estudiante, nombre },
        }
    }

    const almuerzoPendiente = await biometriaRepository.getDetalleHoy(id_estudiante, 'PENDIENTE')

    if (!almuerzoPendiente) {
        return {
            success: false,
            mensaje: 'No tiene almuerzo asignado para hoy',
            estudiante: { id: id_estudiante, nombre },
        }
    }

    await biometriaRepository.marcarEntregado(almuerzoPendiente.id_detalle)

    return {
        success: true,
        mensaje: 'Almuerzo autorizado',
        estudiante: { id: id_estudiante, nombre },
    }
}

module.exports = { validarHuella }
