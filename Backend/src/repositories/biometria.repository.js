const prisma = require('../config/prisma');

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
    return prisma.reservas.findFirst({
        where: {
            id_estudiante,
            fecha: new Date(new Date().toDateString()),
            estado,
        },
    });
};

const marcarEntregado = (id_reserva) => {
    return prisma.reservas.update({
        where: { id_reserva },
        data: {
            estado: 'ENTREGADA',
        },
    });
};

const registrarHuella = (id_estudiante, finger_id) => {
    return prisma.huellas.upsert({
        where: { finger_id },
        update: { id_estudiante },
        create: { id_estudiante, finger_id },
    })
}

const getEstudiantePorCedula = (numero_identificacion) => {
    return prisma.estudiante.findFirst({
        where: { numero_identificacion: BigInt(numero_identificacion) },
        select: {
            id_estudiante: true,
            nombres: true,
            apellidos: true,
            numero_identificacion: true,
            programa: true,
            huellas: { select: { finger_id: true }, take: 1 }
        }
    })
}

module.exports = { 
    getHuellaConEstudiante, 
    getDetalleHoy, 
    marcarEntregado, 
    registrarHuella,
    getEstudiantePorCedula 
}