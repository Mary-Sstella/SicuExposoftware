const resenaService = require('./resena.service');
const { AppError } = require('../../shared/middleware/error.middleware');
const prisma = require('../../config/prisma');

const getIdEstudiante = async (id_usuario) => {
    const usuario = await prisma.usuarios.findUnique({
        where: { id_usuario },
        select: { id_estudiante: true },
    });
    return usuario?.id_estudiante;
};

const createResena = async (req, res, next) => {
    try {
        const id_estudiante = await getIdEstudiante(req.usuario.id);
        const resena = await resenaService.createResena(req.body, id_estudiante);
        res.status(201).json(resena);
    } catch (error) {
        if (error.message === 'CALIFICACION_INVALIDA') {
            return next(new AppError(400, 'La calificación debe ser entre 1 y 5'));
        }
        if (error.message === 'TEXTO_REQUERIDO') {
            return next(new AppError(400, 'El texto de la reseña es obligatorio'));
        }
        next(error);
    }
};

const getResenas = async (req, res, next) => {
    try {
        const resenas = await resenaService.getResenas();
        res.json(resenas);
    } catch (error) {
        next(error);
    }
};

const getMisResenas = async (req, res, next) => {
    try {
        const id_estudiante = await getIdEstudiante(req.usuario.id);
        const resenas = await resenaService.getMisResenas(id_estudiante);
        res.json(resenas);
    } catch (error) {
        next(error);
    }
};

const togglePublicado = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { publicado } = req.body;
        const resultado = await resenaService.togglePublicado(Number(id), publicado);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
};

const getResenasPublicas = async (req, res, next) => {
    try {
        const resenas = await resenaService.getResenasPublicas();
        res.json(resenas);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createResena,
    getResenas,
    getMisResenas,
    togglePublicado,
    getResenasPublicas
};
