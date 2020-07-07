// Rutas para crear un usuario
const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const {check} = require('express-validator');

//crear un usuario
// api/usuarios

router.post("/", 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un Email valido').isEmail(),
        check('password', 'El password debe ser de minimo 6 caracteres').isLength({min:6})
    ],
    usuariosController.crearUsuario
)

module.exports = router;