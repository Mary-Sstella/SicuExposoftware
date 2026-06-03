const prisma = require('../config/prisma');

const createResena = (data) => {
    return prisma.resenas.create({ data });
};

const getResenas = () => {
    return prisma.resenas.findMany({
        orderBy: { fecha_creacion: 'desc' },
        include: {
            estudiante: {
                select: {
                    nombres: true,
                    apellidos: true,
                },
            },
        },
    });
};

const getMisResenas = (id_estudiante) => {
    return prisma.resenas.findMany({
        where: { id_estudiante },
        orderBy: { fecha_creacion: 'desc' },
    });
};

const togglePublicado = (id, publicado) =>{
    return prisma.resenas.update({
        where: {id_rese_a: id},
        data: {publicado},
    })
}

const getResenasPublicas = () => {
    return prisma.resenas.findMany({
        where: { publicado: true },
        orderBy: { fecha_creacion: 'desc' },
        include: {
            estudiante: {
                select: { nombres: true, apellidos: true },
            },
        },
    });
};

module.exports = {
    createResena,
    getResenas,
    getMisResenas,
    togglePublicado,
    getResenasPublicas

};
