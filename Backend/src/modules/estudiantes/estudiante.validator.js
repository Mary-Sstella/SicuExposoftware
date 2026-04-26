const { body } = require('express-validator')

const createEstudianteValidator = [
    body('numero_identificacion')
        .notEmpty().withMessage('El número de identificación es requerido')
        .isString().withMessage('El número de identificación debe ser texto'),

    body('tipo_identificacion')
        .notEmpty().withMessage('El tipo de identificación es requerido')
        .isIn(['CC', 'TI', 'CE', 'PA']).withMessage('Tipo de identificación no válido'),

    body('nombres')
        .notEmpty().withMessage('Los nombres son requeridos')
        .isString().withMessage('Los nombres deben ser texto'),

    body('apellidos')
        .notEmpty().withMessage('Los apellidos son requeridos')
        .isString().withMessage('Los apellidos deben ser texto'),

    body('correo_personal')
        .notEmpty().withMessage('El correo personal es requerido')
        .isEmail().withMessage('El correo personal no es válido'),

    body('correo_institucional')
        .notEmpty().withMessage('El correo institucional es requerido')
        .isEmail().withMessage('El correo institucional no es válido')
        .contains('@unicesar.edu.co').withMessage('Debe ser un correo institucional'),

    body('programa')
        .notEmpty().withMessage('El programa es requerido'),

    body('estado')
        .notEmpty().withMessage('El estado es requerido')
        .isIn(['ACTIVO', 'INACTIVO']).withMessage('El estado debe ser ACTIVO o INACTIVO'),
]

const updateEstudianteValidator = [
    body('nombres')
        .optional()
        .isString().withMessage('Los nombres deben ser texto'),

    body('apellidos')
        .optional()
        .isString().withMessage('Los apellidos deben ser texto'),

    body('correo_personal')
        .optional()
        .isEmail().withMessage('El correo personal no es válido'),

    body('estado')
        .optional()
        .isIn(['ACTIVO', 'INACTIVO']).withMessage('El estado debe ser ACTIVO o INACTIVO'),
]

module.exports = { createEstudianteValidator, updateEstudianteValidator }