const pagoRepository = require('./pago.repository');
const supabase = require('../../config/supabase');
const prisma = require('../../config/prisma');

const BUCKET = 'pagos-docs';

const MINIMOS = {
    SEMANAL: 2,
    MENSUAL: 8,
};

const subirComprobante = async (file) => {
    const nombreLimpio = file.originalname
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_');

    const ruta = `comprobantes/${Date.now()}-${nombreLimpio}`;
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

const createPago = async (data, file, id_estudiante) => {
    if (!file) throw new Error('PDF_REQUERIDO');

    const CAMPOS_DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    const todasReservas = await prisma.reservas.findMany({
        where: { id_estudiante },
        select: { lunes: true, martes: true, miercoles: true, jueves: true, viernes: true }
    });
    const diasAprobados = CAMPOS_DIAS.filter(d => todasReservas.some(r => r[d] === true));
    if (diasAprobados.length === 0) throw new Error('SIN_RESERVA');

    const dias_pagados = JSON.parse(data.dias_pagados);

    const diasInvalidos = dias_pagados.filter((d) => !diasAprobados.includes(d));
    if (diasInvalidos.length > 0) throw new Error('DIAS_NO_APROBADOS');

    const minimo = MINIMOS[data.tipo_periodo];
    if (!minimo || dias_pagados.length < minimo) throw new Error('CANTIDAD_INVALIDA');

    const cantidad_almuerzos =
        data.tipo_periodo === 'SEMANAL'
            ? dias_pagados.length
            : Number(data.cantidad_almuerzos);

    const pdf_url = await subirComprobante(file);

    return pagoRepository.createPago({
        id_estudiante,
        tipo_periodo: data.tipo_periodo,
        dias_pagados,
        cantidad_almuerzos,
        pdf_url,
        estado: 'PENDIENTE',
    });
};

const getPagos = (estado) => {
    return pagoRepository.getPagos(estado);
};

const getMisPagos = async (id_estudiante, estado) => {
    if (!id_estudiante) return { pagos: [], saldo_disponible: 0, dias_registrados: [] }
    const pagos = await pagoRepository.getMisPagos(id_estudiante, estado);

    const CAMPOS_DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    const todasReservas = await prisma.reservas.findMany({
        where: { id_estudiante },
        select: { lunes: true, martes: true, miercoles: true, jueves: true, viernes: true }
    });
    const dias_registrados = CAMPOS_DIAS.filter(d => todasReservas.some(r => r[d] === true));

    const saldo_disponible = pagos
        .filter((p) => p.estado === 'APROBADO')
        .reduce((acc, p) => acc + p.cantidad_almuerzos - p.almuerzos_usados, 0);

    return { pagos, saldo_disponible, dias_registrados };
};

const getPdfUrlById = async (id) => {
    const pago = await pagoRepository.getPagoById(id);
    if (!pago) throw new Error('NOT_FOUND');
    return getUrlFirmada(pago.pdf_url);
};


const aprobarPago = (id, observacion) => {
    return pagoRepository.updateEstadoPago(id, 'APROBADO', observacion);
};

const rechazarPago = (id, observacion) => {
    return pagoRepository.updateEstadoPago(id, 'RECHAZADO', observacion);
};

module.exports = {
    subirComprobante,
    getUrlFirmada,
    createPago,
    getPagos,
    getMisPagos,
    aprobarPago,
    rechazarPago,
    getPdfUrlById,
};
