const authService = require('./auth.service')

const login = async (req, res) => {
    try {
        const { credencial, password } = req.body

        if (!credencial || !password) {
            return res.status(400).json({ msg: 'Credencial y contraseña son requeridos' })
        }

        const data = await authService.login({ credencial, password })
        res.json(data)
    } catch (error) {
        console.error(error)

        if (error.message === 'Credenciales incorrectas') {
            return res.status(401).json({ msg: 'Credenciales incorrectas' })
        }

        if (error.message === 'Usuario inactivo') {
            return res.status(403).json({ msg: 'Usuario inactivo' })
        }

        res.status(500).json({ msg: 'Error en el servidor' })
    }
}

module.exports = { login }