const pool = require('../config/db')
const bcrypt = require('bcryptjs')

const hashPasswords = async () => {
    const result = await pool.query('SELECT id_usuario, password_hash FROM usuarios')
    
    for (const usuario of result.rows) {
        const hash = await bcrypt.hash(usuario.password_hash, 10)
        await pool.query(
            'UPDATE usuarios SET password_hash = $1 WHERE id_usuario = $2',
            [hash, usuario.id_usuario]
        )
        console.log(`Usuario ${usuario.id_usuario} actualizado`)
    }

    console.log('Todos los passwords hasheados')
    process.exit()
}

hashPasswords()