const authService = require('../services/auth.service')
const { AppError } = require('../middleware/error.middleware')
const { MESSAGES } = require('../constants/messages')

const login = async (req, res, next) => {
    try {
        const { credencial, password } = req.body
        const data = await authService.login({ credencial, password })
        res.json(data)
    } catch (error) {
        if (error.message === 'Credenciales incorrectas') {
            return next(new AppError(401, MESSAGES.CREDENCIALES_INCORRECTAS))
        }
        if (error.message === 'Usuario inactivo') {
            return next(new AppError(403, MESSAGES.USUARIO_INACTIVO))
        }
        next(error)
    }
}

module.exports = { login }