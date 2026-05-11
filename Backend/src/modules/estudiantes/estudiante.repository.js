const prisma = require('../../config/prisma')

// Obtener todos los estudiantes
const getEstudiantes = async () => {
    return await prisma.estudiante.findMany()
}

// Obtener por ID
const getEstudianteById = async (id) => {
    return await prisma.estudiante.findUnique({
        where: { id_estudiante: parseInt(id) }
    })
}

// Crear estudiante
const createEstudiante = async (data) => {
    return await prisma.estudiante.create({
        data: {
            numero_identificacion: BigInt(data.numero_identificacion),
            tipo_identificacion: data.tipo_identificacion,
            nombres: data.nombres,
            apellidos: data.apellidos,
            correo_personal: data.correo_personal,
            correo_institucional: data.correo_institucional,
            programa: data.programa,
            estado: data.estado,
            contador_inasistencias: data.contador_inasistencias || 0,
            limite_inasistencias: data.limite_inasistencias || 3
        }
    })
}

// Actualizar estudiante
const updateEstudiante = async (id, data) => {
    return await prisma.estudiante.update({
        where: { id_estudiante: parseInt(id) },
        data: {
            nombres: data.nombres,
            apellidos: data.apellidos,
            correo_personal: data.correo_personal,
            programa: data.programa,
            estado: data.estado
        }
    })
}

// Actualizar estudiante y días de reserva
const updateEstudianteDias = async (id, data) => {
    if (data.nombres || data.apellidos || data.correo_personal || data.correo_institucional || data.programa || data.estado) {
        await prisma.estudiante.update({
            where: { id_estudiante: parseInt(id) },
            data: {
                nombres: data.nombres,
                apellidos: data.apellidos,
                correo_personal: data.correo_personal,
                correo_institucional: data.correo_institucional,
                programa: data.programa,
                estado: data.estado
            }
        })
    }

    if (data.dias) {
        const reservaExiste = await prisma.reservas.findFirst({
            where: { id_estudiante: parseInt(id) }
        })

        if (reservaExiste) {
            await prisma.reservas.update({
                where: { id_reserva: reservaExiste.id_reserva },
                data: {
                    lunes: data.dias.lunes,
                    martes: data.dias.martes,
                    miercoles: data.dias.miercoles,
                    jueves: data.dias.jueves,
                    viernes: data.dias.viernes
                }
            })
        }
    }

    return await prisma.estudiante.findUnique({
        where: { id_estudiante: parseInt(id) }
    })
}

// Eliminar estudiante
const deleteEstudiante = async (id) => {
    return await prisma.estudiante.delete({
        where: { id_estudiante: parseInt(id) }
    })
}

module.exports = {
    getEstudiantes,
    getEstudianteById,
    createEstudiante,
    updateEstudiante,
    updateEstudianteDias,
    deleteEstudiante
}