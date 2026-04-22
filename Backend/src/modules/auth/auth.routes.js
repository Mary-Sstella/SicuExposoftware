const { Router } = require('express')
const controller = require('./auth.controller')
const { loginValidator } = require('./auth.validator')
const { validate } = require('../../shared/middleware/validate.middleware')

const router = Router()

router.post('/login', loginValidator, validate, controller.login)

module.exports = router