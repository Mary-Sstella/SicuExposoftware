const { Router } = require('express')

const userRoutes = require('../modules/users/user.routes')

const router = Router()

router.use('/users', userRoutes)

module.exports = router