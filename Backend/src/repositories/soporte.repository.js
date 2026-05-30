const prisma = require('../config/prisma');

const createSoporte = (data) => {
    return prisma.soporte.create({ data });
};

const getSoportes = () => {
    return prisma.soporte.findMany({
        orderBy: { fecha_creacion: 'desc' },
    });
};

const getSoporteById = (id) => {
    return prisma.soporte.findUnique({
        where: { id_soporte: id },
    });
};

const responderSoporte = (id, respuesta) => {
    return prisma.soporte.update({
        where: { id_soporte: id },
        data: {
            respuesta,
            estado: 'RESUELTO',
            fecha_respuesta: new Date(),
        },
    });
};

const updateEstadoSoporte = (id, estado) => {
    return prisma.soporte.update({
        where: { id_soporte: id },
        data: { estado },
    });
};

module.exports = {
    createSoporte,
    getSoportes,
    getSoporteById,
    responderSoporte,
    updateEstadoSoporte,
};
