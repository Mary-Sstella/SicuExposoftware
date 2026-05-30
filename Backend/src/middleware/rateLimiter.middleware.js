const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 500,                  // 500 peticiones por ventana
    message: {
        msg: 'Demasiadas solicitudes, intenta en 15 minutos'
    }
})

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10,                   // 10 intentos de login por hora
    message: {
        msg: 'Demasiados intentos de autenticación, intenta en 1 hora'
    }
})

module.exports = { apiLimiter, authLimiter }