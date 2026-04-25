const MESSAGES = {
    // Generales
    ERROR_SERVIDOR: 'Error interno del servidor',
    NO_AUTORIZADO: 'Token requerido',
    TOKEN_INVALIDO: 'Token inválido o expirado',
    SIN_PERMISOS: 'No tienes permisos para acceder a este recurso',

    // Estudiantes
    ESTUDIANTE_NO_ENCONTRADO: 'Estudiante no encontrado',
    ESTUDIANTE_CREADO: 'Estudiante creado exitosamente',
    ESTUDIANTE_ACTUALIZADO: 'Estudiante actualizado',
    ESTUDIANTE_ELIMINADO: 'Estudiante eliminado',
    ESTUDIANTE_DUPLICADO: 'El número de identificación ya está registrado',

    // Usuarios
    USUARIO_NO_ENCONTRADO: 'Usuario no encontrado',
    USUARIO_CREADO: 'Usuario creado exitosamente',
    USUARIO_ACTUALIZADO: 'Usuario actualizado',
    USUARIO_ELIMINADO: 'Usuario eliminado',
    USUARIO_DUPLICADO: 'El correo o username ya está registrado',

    // Auth
    CREDENCIALES_INCORRECTAS: 'Credenciales incorrectas',
    USUARIO_INACTIVO: 'Usuario inactivo',
}

module.exports = { MESSAGES }