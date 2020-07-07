const express = require("express");
const router = express.Router();
const {check} = require("express-validator")
const auth = require("../middlewer/auth")
const tareaController = require('../controllers/tareaController')


//crear Tarea
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
)

//obtener tareas
router.get('/',
    auth,
    tareaController.obtenerTareas
)

//actualizar tarea
router.put('/:id',
    auth,
    [
        check('nombre', "El nombre es obligatorio"),
        check('estado', 'El estado es obligatorio')
    ],
    tareaController.actualizarTarea
)

//Eliminar tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
    );

module.exports = router