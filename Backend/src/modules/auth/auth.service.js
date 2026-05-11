const prisma = require('../../config/prisma')
const env = require('../../config/env')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { ROLES } = require('../../shared/constants/roles')

const login = async ({ credencial, password }) => {
    // Buscar usuario por username o email
    const usuario = await prisma.usuarios.findFirst({
        where: {
            OR: [
                { username: credencial },
                { email: credencial }
            ]
        }
    })

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

    // Si es estudiante buscar su id_estudiante
    let id_estudiante = null
    if (usuario.rol === ROLES.ESTUDIANTE) {
        const est = await prisma.estudiante.findFirst({
            where: { correo_institucional: usuario.email },
            select: { id_estudiante: true }
        })
        id_estudiante = est?.id_estudiante ?? null
    }

    return {
        token,
        rol: usuario.rol,
        username: usuario.username || usuario.email,
        id_estudiante
    }
}

module.exports = { login }