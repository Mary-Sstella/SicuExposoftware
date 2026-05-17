const configuracionRepository = require('./configuracion.repository');

const getConfiguracion = () => {
    return configuracionRepository.getConfiguracion();
};

const updateConfiguracion = (data, id_usuario) => {
    return configuracionRepository.updateConfiguracion({
        ...data,
        actualizado_por: id_usuario,
        actualizado_en: new Date(),
    });
};

module.exports = {
    getConfiguracion,
    updateConfiguracion,
};
