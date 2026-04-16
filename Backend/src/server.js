require('dotenv').config()
const env = require('./config/env')
const app = require('./app')

const PORT = env.port || 3000

app.listen(PORT, () => {
    console.log(`Servidor se levantó en el puerto ${PORT}`)
})