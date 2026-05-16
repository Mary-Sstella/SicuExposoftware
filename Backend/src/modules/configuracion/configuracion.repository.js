const prisma = require('../../config/prisma');

const getConfiguracion = () => {
    return prisma.configuracion_formulario.findFirst();
};

const updateConfiguracion = (data) => {
    return prisma.configuracion_formulario.update({
        where: { id: 1 },
        data,
    });
};

module.exports = {
    getConfiguracion,
    updateConfiguracion,
};
