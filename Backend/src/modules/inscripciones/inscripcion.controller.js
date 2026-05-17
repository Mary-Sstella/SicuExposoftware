const inscripcionService = require('./inscripcion.service');
const { AppError } = require('../../shared/middleware/error.middleware');
const { MESSAGES } = require('../../shared/constants/messages');

const createInscripcion = async (req, res, next) => {
    try {
        const inscripcion = await inscripcionService.createInscripcion(req.body, req.files)
        res.status(201).json(inscripcion)
    } catch (error) {
        if (error?.code === 'P2002') {
            return next(new AppError(409, 'La cédula ya tiene una solicitud registrada'))
        }
        if (error?.code === 'LIMIT_FILE_SIZE') {
            return next(new AppError(400, 'El archivo no debe superar 5MB'))
        }
        next(error)
    }
}

const getInscripciones = async (req, res, next) => {
    try {
        const inscripciones = await inscripcionService.getInscripciones();
        res.json(inscripciones);
    } catch (error) {
        next(error);
    }
};

const getInscripcionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const inscripcion = await inscripcionService.getInscripcionById(Number(id));

        if (!inscripcion) {
            throw new AppError(404, 'Inscripción no encontrada');
        }

        res.json(inscripcion);
    } catch (error) {
        next(error);
    }
};

const updateEstadoInscripcion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado, dias } = req.body;

        let inscripcion;

        if (estado === 'APROBADO') {
            inscripcion = await inscripcionService.aprobarInscripcion(Number(id), dias);
        } else if (estado === 'RECHAZADO') {
            inscripcion = await inscripcionService.rechazarInscripcion(Number(id));
        } else {
            throw new AppError(400, 'Estado inválido');
        }

        res.json(inscripcion);
    } catch (error) {
        if (error?.code === 'P2002') {
            return next(new AppError(409, 'El correo institucional ya tiene un usuario registrado'));
        }
        if (error.message === 'La cédula ya tiene un usuario registrado') {
            return next(new AppError(409, error.message));
        }
        if (error.message === 'SIN_CUPO') {
            return next(new AppError(409, 'No hay cupos disponibles para ninguno de los días solicitados'));
        }
        if (error.message === 'YA_ACTIVO') {
            return next(new AppError(409, 'Este estudiante ya tiene una cuenta activa'));
        }
        next(error);
    }
};

const getCupos = async (req, res, next) => {
  try {
    const cupos = await inscripcionService.getCupos();
    res.json(cupos);
  } catch (error) {
    next(error);
  }
};


module.exports = {
    createInscripcion,
    getInscripciones,
    getInscripcionById,
    updateEstadoInscripcion,
    getCupos,
};
