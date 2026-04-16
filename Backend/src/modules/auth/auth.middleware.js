const jwt = require('jsonwebtoken')
const env = require('../../config/env')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

    if (!token) {
        return res.status(401).json({ msg: 'Token requerido' })
    }

    try {
        const decoded = jwt.verify(token, env.jwt.secret)
        req.usuario = decoded
        next()
    } catch (error) {
        return res.status(403).json({ msg: 'Token inválido o expirado' })
    }
}

const verifyRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({ msg: 'No tienes permisos para acceder a este recurso' })
        }
        next()
    }
}

module.exports = { verifyToken, verifyRole }