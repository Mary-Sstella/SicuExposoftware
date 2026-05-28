const prisma = require('../../config/prisma');

const getHuellaConEstudiante = (finger_id) => {
    return prisma.huellas.findUnique({
        where: { finger_id },
        include: {
            estudiante: {
                select: { id_estudiante: true, nombres: true, apellidos: true },
            },
        },
    });
};

const getDetalleHoy = (id_estudiante, estado) => {
    return prisma.detalle_reserva.findFirst({
        where: {
            id_estudiante,
            fecha_comida: new Date(new Date().toDateString()),
            estado,
        },
    });
};

const marcarEntregado = (id_detalle) => {
    return prisma.detalle_reserva.update({
        where: { id_detalle },
        data: {
            estado: 'ENTREGADO',
            asistio: 'SI',
            fecha_entrega: new Date(),
        },
    });
};

module.exports = {
    getHuellaConEstudiante,
    getDetalleHoy,
    marcarEntregado,
};
