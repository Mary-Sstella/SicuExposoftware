const inscripcionRepository = require('./inscripcion.repository');
const supabase = require('../../config/supabase');
const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');

const BUCKET = 'inscripciones-docs';

const subirArchivo = async (file, carpeta) => {
  const ruta = `${carpeta}/${Date.now()}-${file.originalname}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(ruta, file.buffer, { contentType: file.mimetype });

  if (error) throw new Error(error.message);
  return ruta;
};

const getUrlFirmada = async (ruta) => {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(ruta, 600);

  if (error) throw new Error(error.message);
  return data.signedUrl;
};

const createInscripcion = async (data, files) => {
  const sisben_pdf = await subirArchivo(files.sisben_pdf[0], 'sisben');
  const cedula_pdf = await subirArchivo(files.cedula_pdf[0], 'cedula');

  return inscripcionRepository.createInscripcion({
    ...data,
    sisben_pdf,
    cedula_pdf,
  });
};

const getInscripciones = () => {
  return inscripcionRepository.getInscripciones();
};

const getInscripcionById = async (id) => {
  const inscripcion = await inscripcionRepository.getInscripcionById(id);

  const [sisben_url, cedula_url] = await Promise.all([
    getUrlFirmada(inscripcion.sisben_pdf),
    getUrlFirmada(inscripcion.cedula_pdf),
  ]);

  return { ...inscripcion, sisben_url, cedula_url };
};

const aprobarInscripcion = async (id) => {
  const inscripcion = await inscripcionRepository.getInscripcionById(id);

  const password_hash = await bcrypt.hash(inscripcion.cedula, 10);

  const estudiante = await prisma.estudiante.create({
    data: {
      numero_identificacion: BigInt(inscripcion.cedula),
      tipo_identificacion: 'CC',
      nombres: inscripcion.nombre,
      apellidos: inscripcion.apellidos,
      correo_personal: inscripcion.correo_personal,
      correo_institucional: inscripcion.correo_institucional,
      programa: inscripcion.carrera,
      estado: 'ACTIVO',
      contador_inasistencias: 0,
      limite_inasistencias: 3,
    },
  });

  await prisma.usuarios.create({
    data: {
      email: inscripcion.correo_institucional,
      password_hash,
      rol: 'ESTUDIANTE',
      id_estudiante: estudiante.id_estudiante,
    },
  });

  const dias = inscripcion.dias_semana.split(',').map(d => d.trim())
  await prisma.reservas.create({
    data: {
      id_estudiante: estudiante.id_estudiante,
      fecha: new Date(),
      lunes: dias.includes('Lunes'),
      martes: dias.includes('Martes'),
      miercoles: dias.includes('Miércoles'),
      jueves: dias.includes('Jueves'),
      viernes: dias.includes('Viernes'),
      estado: 'PENDIENTE',
      numero_identificacion: BigInt(inscripcion.cedula),
      nombre_estudiante: `${inscripcion.nombre} ${inscripcion.apellidos}`,
      numero_turno: null
    }
  })

  return inscripcionRepository.updateEstadoInscripcion(id, 'APROBADO');
};

const rechazarInscripcion = async (id) => {
  const inscripcion = await inscripcionRepository.getInscripcionById(id);

  await supabase.storage
    .from(BUCKET)
    .remove([inscripcion.sisben_pdf, inscripcion.cedula_pdf]);

  return inscripcionRepository.eliminarInscripcion(id);
};

module.exports = {
  subirArchivo,
  getUrlFirmada,
  createInscripcion,
  getInscripciones,
  getInscripcionById,
  aprobarInscripcion,
  rechazarInscripcion,
};
