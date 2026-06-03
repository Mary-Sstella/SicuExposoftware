const resenaRepository = require('../repositories/resena.repository');

const createResena = (data, id_estudiante) => {
    const calificacion = Number(data.calificacion);

    if (!calificacion || calificacion < 1 || calificacion > 5) {
        throw new Error('CALIFICACION_INVALIDA');
    }

    if (!data.texto || data.texto.trim() === '') {
        throw new Error('TEXTO_REQUERIDO');
    }

    return resenaRepository.createResena({
        id_estudiante,
        calificacion,
        texto: data.texto,
    });
};

const getResenas = () => {
    return resenaRepository.getResenas();
};

const getMisResenas = (id_estudiante) => {
    return resenaRepository.getMisResenas(id_estudiante);
};

const togglePublicado = (id, publicado) => {
    return resenaRepository.togglePublicado(id, publicado);
};

const getResenasPublicas = () => {
    return resenaRepository.getResenasPublicas();
};

module.exports = {
    createResena,
    getResenas,
    getMisResenas,
    togglePublicado,
    getResenasPublicas
};
