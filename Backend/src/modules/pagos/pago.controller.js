const pagoService = require('./pago.service');
const { AppError } = require('../../shared/middleware/error.middleware');
const prisma = require('../../config/prisma');

const getIdEstudiante = async (id_usuario) => {
    const usuario = await prisma.usuarios.findUnique({
        where: { id_usuario },
        select: { id_estudiante: true },
    });
    return usuario?.id_estudiante;
};

const createPago = async (req, res, next) => {
    try {
        const id_estudiante = await getIdEstudiante(req.usuario.id);
        const pago = await pagoService.createPago(
            req.body,
            req.files?.comprobante_pdf?.[0],
            id_estudiante
        );
        res.status(201).json(pago);
    } catch (error) {
        if (error.message === 'PDF_REQUERIDO') {
            return next(new AppError(400, 'El comprobante PDF es obligatorio'));
        }
        if (error.message === 'SIN_RESERVA') {
            return next(new AppError(404, 'No tienes días de almuerzo asignados'));
        }
        if (error.message === 'DIAS_NO_APROBADOS') {
            return next(new AppError(400, 'Algunos días seleccionados no están en tus días aprobados'));
        }
        if (error.message === 'CANTIDAD_INVALIDA') {
            return next(new AppError(400, 'La cantidad de días no cumple el mínimo requerido'));
        }
        next(error);
    }
};

const getPagos = async (req, res, next) => {
    try {
        const { estado } = req.query;
        const pagos = await pagoService.getPagos(estado);
        res.json(pagos);
    } catch (error) {
        next(error);
    }
};

const getMisPagos = async (req, res, next) => {
    try {
        const id_estudiante = await getIdEstudiante(req.usuario.id);
        const { estado } = req.query;
        const resultado = await pagoService.getMisPagos(id_estudiante, estado);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
};

const updateEstadoPago = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado, observacion } = req.body;

        let pago;
        if (estado === 'APROBADO') {
            pago = await pagoService.aprobarPago(Number(id), observacion);
        } else if (estado === 'RECHAZADO') {
            pago = await pagoService.rechazarPago(Number(id), observacion);
        } else {
            throw new AppError(400, 'Estado inválido');
        }

        res.json(pago);
    } catch (error) {
        next(error);
    }
};

const getPdfUrl = async (req, res, next) => {
    try {
        const { id } = req.params;
        const url = await pagoService.getPdfUrlById(Number(id));
        res.json({ url });
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return next(new AppError(404, 'Pago no encontrado'));
        }
        next(error);
    }
};



module.exports = {
    createPago,
    getPagos,
    getMisPagos,
    updateEstadoPago,
    getPdfUrl,
};
