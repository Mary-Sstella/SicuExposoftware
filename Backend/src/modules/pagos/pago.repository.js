const prisma = require('../../config/prisma');

const createPago = (data) => {
    return prisma.pagos.create({ data });
};

const getPagos = () => {
    return prisma.pagos.findMany({
        orderBy: { fecha_subida: 'desc' },
        include: {
            estudiante: {
                select: {
                    nombres: true,
                    apellidos: true,
                    correo_institucional: true,
                },
            },
        },
    });
};

const getMisPagos = (id_estudiante) => {
    return prisma.pagos.findMany({
        where: { id_estudiante },
        orderBy: { fecha_subida: 'desc' },
    });
};

const getPagoById = (id) => {
    return prisma.pagos.findUnique({
        where: { id_pago: id },
    });
};

const updateEstadoPago = (id, estado, observacion) => {
    return prisma.pagos.update({
        where: { id_pago: id },
        data: {
            estado,
            observacion,
            fecha_revision: new Date(),
        },
    });
};

module.exports = {
    createPago,
    getPagos,
    getMisPagos,
    getPagoById,
    updateEstadoPago,
};
