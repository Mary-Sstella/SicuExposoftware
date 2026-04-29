const { body } = require('express-validator')
const { ROLES } = require('../../shared/constants/roles')

const createUsuarioValidator = [
    body('password_hash')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('rol')
        .notEmpty().withMessage('El rol es requerido')
        .isIn([ROLES.ADMIN, ROLES.ESTUDIANTE]).withMessage('El rol debe ser ADMIN o ESTUDIANTE'),

    body('email')
        .if(body('rol').equals(ROLES.ESTUDIANTE))
        .notEmpty().withMessage('El correo es requerido para estudiantes')
        .isEmail().withMessage('El correo no es válido')
        .contains('@unicesar.edu.co').withMessage('Debe ser un correo institucional'),

    body('username')
        .if(body('rol').equals(ROLES.ADMIN))
        .notEmpty().withMessage('El username es requerido para administradores')
]

const updateUsuarioValidator = [
    body('rol')
        .optional()
        .isIn([ROLES.ADMIN, ROLES.ESTUDIANTE]).withMessage('El rol debe ser ADMIN o ESTUDIANTE'),

    body('activo')
        .optional()
        .isBoolean().withMessage('El campo activo debe ser true o false')
]

module.exports = { createUsuarioValidator, updateUsuarioValidator }