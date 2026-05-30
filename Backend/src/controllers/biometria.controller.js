const biometriaService = require('../services/biometria.service')
const { AppError } = require('../middleware/error.middleware')

const validarHuella = async (req, res, next) => {
    try {
        const { finger_id } = req.body

        if (!finger_id) {
            return next(new AppError(400, 'finger_id es requerido'))
        }

        const resultado = await biometriaService.validarHuella(finger_id)
        return res.json(resultado)
    } catch (error) {
        next(error)
    }
}

module.exports = { validarHuella }
