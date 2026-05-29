const configuracionRepository = require('./configuracion.repository');
const prisma = require('../../config/prisma');
const { enviarNotificacion } = require('../notificaciones/notificacion.service');

const getConfiguracion = () => {
    return configuracionRepository.getConfiguracion();
};

const updateConfiguracion = async (data, id_usuario) => {
    const resultado = await configuracionRepository.updateConfiguracion({
        ...data,
        actualizado_por: id_usuario,
        actualizado_en: new Date(),
    });

    if (data.activo) {
        const estudiantes = await prisma.estudiante.findMany({
            where: { estado: 'ACTIVO' },
            select: { id_estudiante: true },
        });

        estudiantes.forEach(e => {
            enviarNotificacion(
                e.id_estudiante,
                'FORMULARIO_HABILITADO',
                '📋 Formulario de inscripción disponible',
                'El formulario de inscripción al comedor ya está disponible. Ingresa y solicita tu beneficio.'
            )
        });
    }

    return resultado;
};

module.exports = {
    getConfiguracion,
    updateConfiguracion,
};
