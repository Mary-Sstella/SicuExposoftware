const prisma = require('../config/prisma');

const getMenu = () => {
    return prisma.menu.findFirst({
        orderBy: { fecha_subida: 'desc' },
    });
};

const createMenu = (data) => {
    return prisma.menu.create({ data });
};

const deleteMenu = (id) => {
    return prisma.menu.delete({
        where: { id_menu: id },
    });
};

module.exports = {
    getMenu,
    createMenu,
    deleteMenu,
};
