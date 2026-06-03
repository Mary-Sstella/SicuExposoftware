const loggerMiddleware = (req, res, next) => {
    const start = Date.now()
    const { method, path } = req

    res.on('finish', () => {
        const ms = Date.now() - start
        const status = res.statusCode
        const color = status >= 500 ? '\x1b[31m'   // rojo
                    : status >= 400 ? '\x1b[33m'   // amarillo
                    : status >= 200 ? '\x1b[32m'   // verde
                    : '\x1b[0m'

        console.log(`${color}${method}\x1b[0m ${path} → ${status} (${ms}ms)`)
    })

    next()
}

module.exports = { loggerMiddleware }