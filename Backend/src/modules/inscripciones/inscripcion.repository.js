const prisma = require('../../config/prisma');

const createInscripcion = (data) => {
  return prisma.inscripciones.create({ data });
};

const getInscripciones = () => {
  return prisma.inscripciones.findMany({
    select: {
      id_inscripcion: true,
      nombre: true,
      apellidos: true,
      cedula: true,
      estado: true,
      fecha_solicitud: true,
    },
    orderBy: { fecha_solicitud: 'desc' },
  });
};

const getInscripcionById = (id) => {
  return prisma.inscripciones.findUnique({
    where: { id_inscripcion: id },
  });
};

const updateEstadoInscripcion = (id, estado) => {
  return prisma.inscripciones.update({
    where: { id_inscripcion: id },
    data: { estado },
  });
};

module.exports = {
  createInscripcion,
  getInscripciones,
  getInscripcionById,
  updateEstadoInscripcion,
};
