const { Router } = require('express')
const controller = require('../controllers/auth.controller')
const { loginValidator } = require('../middleware/auth.validator')
const { validate } = require('../middleware/validate.middleware')

const router = Router()
const { authLimiter } = require('../middleware/rateLimiter.middleware')

router.post('/login', authLimiter, loginValidator, validate, controller.login)
router.post('/login', loginValidator, validate, controller.login)

module.exports = router