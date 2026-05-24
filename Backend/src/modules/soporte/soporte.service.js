const soporteRepository = require('./soporte.repository');
const supabase = require('../../config/supabase');
const { enviarRespuestaSoporte } = require('../../shared/utils/email');

const BUCKET = 'soporte-docs';

const subirArchivo = async (file) => {
    const nombreLimpio = file.originalname
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_');

    const ruta = `archivos/${Date.now()}-${nombreLimpio}`;
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

const createSoporte = async (data, file) => {
    let archivo_url = null;

    if (file) {
        archivo_url = await subirArchivo(file);
    }

    return soporteRepository.createSoporte({
        nombre: data.nombre,
        correo: data.correo,
        asunto: data.asunto,
        descripcion: data.descripcion,
        archivo_url,
    });
};

const getSoportes = () => {
    return soporteRepository.getSoportes();
};

const getSoporteById = async (id) => {
    const soporte = await soporteRepository.getSoporteById(id);

    if (soporte?.archivo_url) {
        const archivo_firmada_url = await getUrlFirmada(soporte.archivo_url);
        return { ...soporte, archivo_firmada_url };
    }

    return soporte;
};

const responderSoporte = async (id, respuesta) => {
    const resultado = await soporteRepository.responderSoporte(id, respuesta);

    enviarRespuestaSoporte({
        nombre: resultado.nombre,
        correo: resultado.correo,
        asunto: resultado.asunto,
        respuesta,
    });

    return resultado;
};

const updateEstadoSoporte = (id, estado) => {
    return soporteRepository.updateEstadoSoporte(id, estado);
};

module.exports = {
    subirArchivo,
    getUrlFirmada,
    createSoporte,
    getSoportes,
    getSoporteById,
    responderSoporte,
    updateEstadoSoporte,
};