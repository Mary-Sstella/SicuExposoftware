const authService = require('./auth.service')
const { AppError } = require('../../shared/middleware/error.middleware')

const login = async (req, res, next) => {
    try {
        const { credencial, password } = req.body
        const data = await authService.login({ credencial, password })
        res.json(data)
    } catch (error) {
        if (error.message === 'Credenciales incorrectas') {
            return next(new AppError(401, 'Credenciales incorrectas'))
        }
        if (error.message === 'Usuario inactivo') {
            return next(new AppError(403, 'Usuario inactivo'))
        }
        next(error)
    }
}

module.exports = { login }