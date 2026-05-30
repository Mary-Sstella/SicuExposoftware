const soporteService = require('../services/soporte.service');
const { AppError } = require('../middleware/error.middleware');

const ESTADOS_VALIDOS = ['PENDIENTE', 'EN_PROCESO', 'RESUELTO'];

const createSoporte = async (req, res, next) => {
    try {
        const soporte = await soporteService.createSoporte(req.body, req.files?.archivo?.[0]);
        res.status(201).json(soporte);
    } catch (error) {
        next(error);
    }
};

const getSoportes = async (req, res, next) => {
    try {
        const soportes = await soporteService.getSoportes();
        res.json(soportes);
    } catch (error) {
        next(error);
    }
};

const getSoporteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const soporte = await soporteService.getSoporteById(Number(id));

        if (!soporte) {
            throw new AppError(404, 'Soporte no encontrado');
        }

        res.json(soporte);
    } catch (error) {
        next(error);
    }
};

const responderSoporte = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { respuesta } = req.body;
        const resultado = await soporteService.responderSoporte(Number(id), respuesta);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
};

const updateEstadoSoporte = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!ESTADOS_VALIDOS.includes(estado)) {
            throw new AppError(400, 'Estado inválido');
        }

        const resultado = await soporteService.updateEstadoSoporte(Number(id), estado);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSoporte,
    getSoportes,
    getSoporteById,
    responderSoporte,
    updateEstadoSoporte,
};
