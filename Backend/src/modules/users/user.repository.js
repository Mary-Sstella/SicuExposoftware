const pool = require('../../config/db')

// Obtener todos los usuarios
const getUsuarios = async () => {
    const result = await pool.query('SELECT * FROM usuarios')
    return result.rows
}

// Obtener por ID
const getUsuarioById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM usuarios WHERE id_usuario = $1',
        [id]
    )
    return result.rows[0]
}

// Crear usuario
const createUsuario = async (data) => {
    const result = await pool.query(
        `INSERT INTO usuarios 
        (username, email, password_hash, rol, id_estudiante)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            data.username,
            data.email,
            data.password_hash,
            data.rol,
            data.id_estudiante
        ]
    )
    return result.rows[0]
}

// Actualizar usuario
const updateUsuario = async (id, data) => {
    const result = await pool.query(
        `UPDATE usuarios SET
        username = $1,
        email = $2,
        rol = $3,
        activo = $4
        WHERE id_usuario = $5
        RETURNING *`,
        [
            data.username,
            data.email,
            data.rol,
            data.activo,
            id
        ]
    )
    return result
}

// Eliminar usuario
const deleteUsuario = async (id) => {
    const result = await pool.query(
        'DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *',
        [id]
    )
    return result
}

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
}