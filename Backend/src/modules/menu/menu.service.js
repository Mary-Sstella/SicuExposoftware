const menuRepository = require('./menu.repository');
const supabase = require('../../config/supabase');

const BUCKET = 'menu-docs';

const subirArchivo = async (file) => {
    const nombreLimpio = file.originalname
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_');

    const ruta = 'menus/' + Date.now() + '-' + nombreLimpio;
    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(ruta, file.buffer, { contentType: file.mimetype });

    if (error) throw new Error(error.message);
    return ruta;
};

const getUrlFirmada = async (ruta) => {
    const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(ruta, 3600);

    if (error) throw new Error(error.message);
    return data.signedUrl;
};

const getMenu = async () => {
    const menu = await menuRepository.getMenu();
    if (!menu) return null;

    const archivo_firmada_url = await getUrlFirmada(menu.archivo_url);
    return { ...menu, archivo_firmada_url };
};

const uploadMenu = async (file, id_usuario) => {
    if (!file) throw new Error('ARCHIVO_REQUERIDO');

    const menuActual = await menuRepository.getMenu();

    if (menuActual) {
        await supabase.storage.from(BUCKET).remove([menuActual.archivo_url]);
        await menuRepository.deleteMenu(menuActual.id_menu);
    }

    const archivo_url = await subirArchivo(file);

    return menuRepository.createMenu({
        archivo_url,
        tipo_archivo: file.mimetype,
        subido_por: id_usuario,
    });
};

const deleteMenu = async () => {
    const menuActual = await menuRepository.getMenu();
    if (!menuActual) throw new Error('SIN_MENU');

    await supabase.storage.from(BUCKET).remove([menuActual.archivo_url]);
    await menuRepository.deleteMenu(menuActual.id_menu);

    return { msg: 'Menú eliminado correctamente' };
};

module.exports = {
    subirArchivo,
    getUrlFirmada,
    getMenu,
    uploadMenu,
    deleteMenu,
};