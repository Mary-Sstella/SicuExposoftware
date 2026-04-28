const jwt = require('jsonwebtoken')
const env = require('../../config/env')
const { MESSAGES } = require('../constants/messages')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ msg: MESSAGES.NO_AUTORIZADO })
    }

    try {
        const decoded = jwt.verify(token, env.jwt.secret)
        req.usuario = decoded
        next()
    } catch (error) {
        return res.status(403).json({ msg: MESSAGES.TOKEN_INVALIDO })
    }
}

const verifyRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({ msg: MESSAGES.SIN_PERMISOS })
        }
        next()
    }
}

module.exports = { verifyToken, verifyRole }