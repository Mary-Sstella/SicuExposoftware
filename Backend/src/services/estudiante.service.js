const estudianteRepository = require('../repositories/estudiante.repository')
const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const { ROLES } = require('../constants/roles')

// Obtener todos
const getEstudiantes = async () => {
    return await estudianteRepository.getEstudiantes()
}

// Obtener por ID
const getEstudianteById = async (id) => {
    return await estudianteRepository.getEstudianteById(id)
}

// Crear estudiante y usuario automáticamente
const createEstudiante = async (data) => {
    // Crear estudiante
    const estudiante = await estudianteRepository.createEstudiante(data)

    // Hashear número de identificación como contraseña
    const passwordHash = await bcrypt.hash(data.numero_identificacion.toString().trim(), 10)

    // Crear usuario automáticamente
    await prisma.usuarios.create({
        data: {
            email: estudiante.correo_institucional,
            password_hash: passwordHash,
            rol: ROLES.ESTUDIANTE,
            id_estudiante: estudiante.id_estudiante
        }
    })

    return estudiante
}

// Actualizar datos del estudiante
const updateEstudiante = async (id, data) => {
    return await estudianteRepository.updateEstudiante(id, data)
}

// Actualizar días de reserva
const updateEstudianteDias = async (id, data) => {
    return await estudianteRepository.updateEstudianteDias(id, data)
}

// Eliminar
const deleteEstudiante = async (id) => {
  const supabase = require('../config/supabase')
  const estudianteId = parseInt(id)

  const estudiante = await estudianteRepository.getEstudianteById(id)
  if (!estudiante) return null

  // Borrar PDFs de Supabase si tiene inscripción
  const inscripcion = await prisma.inscripciones.findFirst({
    where: { correo_institucional: estudiante.correo_institucional }
  })
  if (inscripcion) {
    const archivos = [inscripcion.sisben_pdf, inscripcion.cedula_pdf].filter(Boolean)
    if (archivos.length > 0) {
      await supabase.storage.from('inscripciones-docs').remove(archivos)
    }
    await prisma.inscripciones.delete({ where: { id_inscripcion: inscripcion.id_inscripcion } })
  }

  // Borrar usuario asociado (no tiene cascade)
  await prisma.usuarios.deleteMany({ where: { id_estudiante: estudianteId } })
  // Desvincular registros sin cascade
  await prisma.qr_generados.deleteMany({ where: { id_estudiante: estudianteId } })
  await prisma.comprobantes.updateMany({ where: { id_estudiante: estudianteId }, data: { id_estudiante: null } })

  return await estudianteRepository.deleteEstudiante(id)
}


module.exports = {
    getEstudiantes,
    getEstudianteById,
    createEstudiante,
    updateEstudiante,
    updateEstudianteDias,
    deleteEstudiante
}