const { body } = require('express-validator')

const loginValidator = [
    body('credencial')
        .notEmpty().withMessage('La credencial es requerida')
        .isString().withMessage('La credencial debe ser texto'),
    
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
]

module.exports = { loginValidator }