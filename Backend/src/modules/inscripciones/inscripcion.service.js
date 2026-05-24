const inscripcionRepository = require('./inscripcion.repository');
const supabase = require('../../config/supabase');
const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');
const { enviarCredenciales } = require('../../shared/utils/email');

const BUCKET = 'inscripciones-docs';

const MAPA_DIAS = {
  'Lunes':      'lunes',
  'Martes':     'martes',
  'Miércoles':  'miercoles',
  'Jueves':     'jueves',
  'Viernes':    'viernes',
};

const subirArchivo = async (file, carpeta) => {
    const nombreLimpio = file.originalname
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_')

    const ruta = `${carpeta}/${Date.now()}-${nombreLimpio}`
    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(ruta, file.buffer, { contentType: file.mimetype })

    if (error) throw new Error(error.message)
    return ruta
}

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
    inscripcion.sisben_pdf ? getUrlFirmada(inscripcion.sisben_pdf).catch(() => null) : Promise.resolve(null),
    inscripcion.cedula_pdf ? getUrlFirmada(inscripcion.cedula_pdf).catch(() => null) : Promise.resolve(null),
  ]);

  return { ...inscripcion, sisben_url, cedula_url };
};


const aprobarInscripcion = async (id, dias) => {
  const inscripcion = await inscripcionRepository.getInscripcionById(id);

  const diasSolicitados = (Array.isArray(dias) && dias.length > 0)
    ? dias
    : inscripcion.dias_semana.split(',').map(d => d.trim());

  const config = await prisma.configuracion_formulario.findFirst();

  const diasAprobados = [];
  for (const dia of diasSolicitados) {
    const campo = MAPA_DIAS[dia];
    if (!campo) continue;
    const ocupados = await prisma.reservas.count({ where: { [campo]: true } });
    const cupo = config[`cupo_${campo}`];
    if (ocupados < cupo) diasAprobados.push(dia);
  }

  if (diasAprobados.length === 0) throw new Error('SIN_CUPO');

  const password_hash = await bcrypt.hash(inscripcion.cedula, 10);

  return prisma.$transaction(async (tx) => {
    let estudiante;
    let esNuevo;

    const estudianteExistente = await tx.estudiante.findFirst({
      where: { correo_institucional: inscripcion.correo_institucional },
    });

    if (estudianteExistente) {
      if (estudianteExistente.estado === 'ACTIVO') throw new Error('YA_ACTIVO');
      estudiante = await tx.estudiante.update({
        where: { id_estudiante: estudianteExistente.id_estudiante },
        data: { estado: 'ACTIVO' },
      });
      esNuevo = false;
    } else {
      estudiante = await tx.estudiante.create({
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
      esNuevo = true;
    }

    const usuarioExistente = await tx.usuarios.findFirst({
      where: { email: inscripcion.correo_institucional },
    });

    if (usuarioExistente) {
      await tx.usuarios.update({
        where: { id_usuario: usuarioExistente.id_usuario },
        data: { activo: true },
      });
    } else {
      await tx.usuarios.create({
        data: {
          email: inscripcion.correo_institucional,
          password_hash,
          rol: 'ESTUDIANTE',
          id_estudiante: estudiante.id_estudiante,
        },
      });
    }

    await tx.reservas.create({
      data: {
        id_estudiante: estudiante.id_estudiante,
        fecha: new Date(),
        lunes:     diasAprobados.includes('Lunes'),
        martes:    diasAprobados.includes('Martes'),
        miercoles: diasAprobados.includes('Miércoles'),
        jueves:    diasAprobados.includes('Jueves'),
        viernes:   diasAprobados.includes('Viernes'),
        estado: 'PENDIENTE',
        numero_identificacion: BigInt(inscripcion.cedula),
        nombre_estudiante: `${inscripcion.nombre} ${inscripcion.apellidos}`,
        numero_turno: null,
      },
    });

    const inscripcionActualizada = await tx.inscripciones.update({
      where: { id_inscripcion: id },
      data: { estado: 'APROBADO' },
    });

    return { inscripcion: inscripcionActualizada, diasAprobados, esNuevo };
  }).then((resultado) => {
    enviarCredenciales({
      nombre: inscripcion.nombre,
      correo: inscripcion.correo_institucional,
      diasAprobados: resultado.diasAprobados,
      esNuevo: resultado.esNuevo,
    });
    return resultado;
  });
};

const rechazarInscripcion = async (id) => {
  const inscripcion = await inscripcionRepository.getInscripcionById(id);

  await supabase.storage
    .from(BUCKET)
    .remove([inscripcion.sisben_pdf, inscripcion.cedula_pdf]);

  return inscripcionRepository.updateEstadoInscripcion(id, 'RECHAZADO');
};

const getCupos = async () => {
  const config = await prisma.configuracion_formulario.findFirst();

  const [oLunes, oMartes, oMiercoles, oJueves, oViernes] = await Promise.all([
    prisma.reservas.count({ where: { lunes: true } }),
    prisma.reservas.count({ where: { martes: true } }),
    prisma.reservas.count({ where: { miercoles: true } }),
    prisma.reservas.count({ where: { jueves: true } }),
    prisma.reservas.count({ where: { viernes: true } }),
  ]);

  return {
    lunes:     { ocupados: oLunes,     total: config.cupo_lunes },
    martes:    { ocupados: oMartes,    total: config.cupo_martes },
    miercoles: { ocupados: oMiercoles, total: config.cupo_miercoles },
    jueves:    { ocupados: oJueves,    total: config.cupo_jueves },
    viernes:   { ocupados: oViernes,   total: config.cupo_viernes },
  };
};


module.exports = {
  subirArchivo,
  getUrlFirmada,
  createInscripcion,
  getInscripciones,
  getInscripcionById,
  aprobarInscripcion,
  rechazarInscripcion,
  getCupos,
};
