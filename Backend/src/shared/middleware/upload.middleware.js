const multer = require('multer');

const ALLOWED_TYPES = ['application/pdf', 'image/png'];
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

const uploadInscripcion = upload.fields([
  { name: 'sisben_pdf', maxCount: 1 },
  { name: 'cedula_pdf', maxCount: 1 },
]);

module.exports = { uploadInscripcion };
