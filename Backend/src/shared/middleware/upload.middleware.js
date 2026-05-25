const multer = require('multer');

const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const fileFilter = (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Solo se aceptan PDF y PNG.`));
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_SIZE },
    fileFilter,
});

const _upload = upload.fields([
    { name: 'sisben_pdf', maxCount: 1 },
    { name: 'cedula_pdf', maxCount: 1 },
]);

const uploadInscripcion = (req, res, next) => {
    _upload(req, res, (err) => {
        if (err) {
            console.log('Error upload:', err.code, err.message)
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ msg: 'El archivo no debe superar 5MB' })
            }
            return res.status(400).json({ msg: err.message })
        }
        next()
    })
}

const _uploadPago = upload.fields([
    { name: 'comprobante_pdf', maxCount: 1 },
]);

const uploadPago = (req, res, next) => {
    _uploadPago(req, res, (err) => {
        if (err) {
            console.log('Error upload:', err.code, err.message)
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ msg: 'El archivo no debe superar 5MB' })
            }
            return res.status(400).json({ msg: err.message })
        }
        next()
    })
}

const _uploadSoporte = upload.fields([
    { name: 'archivo', maxCount: 1 },
]);

const uploadSoporte = (req, res, next) => {
    _uploadSoporte(req, res, (err) => {
        if (err) {
            console.log('Error upload:', err.code, err.message)
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ msg: 'El archivo no debe superar 5MB' })
            }
            return res.status(400).json({ msg: err.message })
        }
        next()
    })
}

const _uploadMenu = upload.fields([
    { name: 'archivo', maxCount: 1 },
]);

const uploadMenu = (req, res, next) => {
    _uploadMenu(req, res, (err) => {
        if (err) {
            console.log('Error upload:', err.code, err.message)
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ msg: 'El archivo no debe superar 5MB' })
            }
            return res.status(400).json({ msg: err.message })
        }
        next()
    })
}

module.exports = { uploadInscripcion, uploadPago, uploadSoporte, uploadMenu };