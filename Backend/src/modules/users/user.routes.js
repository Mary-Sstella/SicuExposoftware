const { Router } = require("express")

const router = Router()

const usuarios = [
    'Andrea',
    'Andrea',
    'Andrea',
    'Andrea',
    'Andrea',
    'Andrea'
]

router.get('/', (req, res) => {
    res.json({ 
        msg: 'Ok users',
        data: usuarios
    })
})

module.exports = router