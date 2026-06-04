const prisma = require('../config/prisma');

const getConfiguracion = () => {
    return prisma.configuracion_formulario.upsert({
        where: { id: 1 },
        update: {},
        create: { activo: false },
    })
}

const updateConfiguracion = (data) => {
    return prisma.configuracion_formulario.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data },
    });
};

const getCuposPorDia = () => {
    return prisma.configuracion_formulario.findFirst({
        select: {
            cupo_lunes: true,
            cupo_martes: true,
            cupo_miercoles: true,
            cupo_jueves: true,
            cupo_viernes: true,
        },
    });
};

const getCupoDia = async (dia) => {
    const campos = {
        lunes: 'cupo_lunes',
        martes: 'cupo_martes',
        miercoles: 'cupo_miercoles',
        jueves: 'cupo_jueves',
        viernes: 'cupo_viernes',
    };

    if (!campos[dia]) throw new Error('Día inválido');

    const campo = campos[dia];
    const config = await prisma.configuracion_formulario.findFirst({
        select: { [campo]: true },
    });

    return config[campo];
};

module.exports = {
    getConfiguracion,
    updateConfiguracion,
    getCuposPorDia,
    getCupoDia,
};
