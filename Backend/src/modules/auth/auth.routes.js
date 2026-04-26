const { Router } = require('express')
const controller = require('./auth.controller')
const { loginValidator } = require('./auth.validator')
const { validate } = require('../../shared/middleware/validate.middleware')

const router = Router()
const { authLimiter } = require('../../shared/middleware/rateLimiter.middleware')

router.post('/login', authLimiter, loginValidator, validate, controller.login)
router.post('/login', loginValidator, validate, controller.login)

module.exports = router