const express = require('express')
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const {check} = require('express-validator');
const auth = require('../middlewer/auth');

//creamos un proyecto
// api/proyectos

router.post('/', 
    auth, 
    [
        check('nombre','El nombre es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

//obtener proyectos
router.get('/', 
    auth, 
    proyectoController.obtenerProyectos
);

//editamos un proyecto
router.put('/:id', 
    auth,
    [
        check('nombre','El nombre es obligatorio').not().isEmpty()
    ], 
    proyectoController.actualizarProyecto
);

//Eliminar el Proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
    );

module.exports = router

