const pool = require('../../config/db')
const env = require('../../config/env')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { ROLES } = require('../../shared/constants/roles')

const login = async ({ credencial, password }) => {
    const result = await pool.query(
        'SELECT * FROM usuarios WHERE username = $1 OR email = $1',
        [credencial]
    )

    const usuario = result.rows[0]

    if (!usuario) {
        throw new Error('Credenciales incorrectas')
    }

    if (!usuario.activo) {
        throw new Error('Usuario inactivo')
    }

    const passwordValida = await bcrypt.compare(password, usuario.password_hash)

    if (!passwordValida) {
        throw new Error('Credenciales incorrectas')
    }

    const token = jwt.sign(
        { id: usuario.id_usuario, rol: usuario.rol },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn }
    )

    return {
        token,
        rol: usuario.rol,
        username: usuario.username || usuario.email,
        id_estudiante: usuario.id_estudiante ?? null
    }
}

module.exports = { login }