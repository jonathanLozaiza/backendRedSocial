// Rutas para autenticar un usuario
const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const {check} = require('express-validator');
const auth = require('../middlewer/auth')

//INicia sesion
router.post("/",
    authController.autenticarUsuarios
)

//devuelve el usuario autenticado
router.get("/", 
   auth,
    authController.usuarioAutenticado
)

module.exports = router;