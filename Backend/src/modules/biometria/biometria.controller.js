const biometriaService = require('./biometria.service')

const validarHuella = async (req, res, next) => {
  try {
    const { finger_id } = req.body

    if (!finger_id) {
      return res.status(400).json({
        success: false,
        mensaje: 'finger_id es requerido'
      })
    }

    const resultado = await biometriaService.validarHuella(finger_id)
    return res.json(resultado)

  } catch (error) {
    next(error)
  }
}

module.exports = { validarHuella }