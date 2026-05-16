const configuracionService = require('./configuracion.service');
const { AppError } = require('../../shared/middleware/error.middleware');

const getConfiguracion = async (req, res, next) => {
    try {
        const config = await configuracionService.getConfiguracion();

        if (!config) {
            throw new AppError(404, 'Configuración no encontrada');
        }

        res.json(config);
    } catch (error) {
        next(error);
    }
};

const updateConfiguracion = async (req, res, next) => {
    try {
        const { activo, fecha_inicio, fecha_fin } = req.body;
        const id_usuario = req.usuario.id;

        const config = await configuracionService.updateConfiguracion(
            { activo, fecha_inicio, fecha_fin },
            id_usuario
        );

        res.json(config);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getConfiguracion,
    updateConfiguracion,
};
