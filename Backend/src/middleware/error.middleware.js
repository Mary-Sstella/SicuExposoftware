class AppError extends Error {
    constructor(statusCode, message) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
        this.name = 'AppError'
    }
}

const errorHandler = (err, req, res, next) => {
    const isDev = process.env.NODE_ENV === 'development'

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            msg: err.message,
            ...(isDev && { stack: err.stack })
        })
    }

    if (err?.code === '23505') {
        return res.status(409).json({ msg: 'El registro ya existe' })
    }

    console.error('[ERROR NO CONTROLADO]', err)
    res.status(500).json({
        msg: 'Error interno del servidor',
        ...(isDev && { stack: err.stack })
    })
}

module.exports = { AppError, errorHandler }