const menuService = require('../services/menu.service');
const { AppError } = require('../middleware/error.middleware');

const getMenu = async (req, res, next) => {
    try {
        const menu = await menuService.getMenu();

        if (!menu) {
            throw new AppError(404, 'No hay menú disponible');
        }

        res.json(menu);
    } catch (error) {
        next(error);
    }
};

const uploadMenu = async (req, res, next) => {
    try {
        const menu = await menuService.uploadMenu(req.files?.archivo?.[0], req.usuario.id);
        res.status(201).json(menu);
    } catch (error) {
        if (error.message === 'ARCHIVO_REQUERIDO') {
            return next(new AppError(400, 'El archivo del menú es obligatorio'));
        }
        next(error);
    }
};

const deleteMenu = async (req, res, next) => {
    try {
        const resultado = await menuService.deleteMenu(req.usuario.id);
        res.json(resultado);
    } catch (error) {
        if (error.message === 'SIN_MENU') {
            return next(new AppError(404, 'No hay menú para eliminar'));
        }
        next(error);
    }
};

module.exports = {
    getMenu,
    uploadMenu,
    deleteMenu,
};
