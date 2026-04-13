const express = require('express')
const { route } = require('./router/users')
const router = require('./router/users')
const cors = require('cors')

const app = express()

app.listen(3000, () => {
    console.log('Servidor se levanto correctamente en el puerto 3000')
})

app.use(cors())

app.use('/api/users',router)