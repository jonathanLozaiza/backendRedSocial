const Tarea = require('../models/Tarea')
const Proyecto = require('../models/Proyecto')
const {validationResult} = require('express-validator')


//crear una tarea
exports.crearTarea = async (req, res) => {

    //verificar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores : errores.array()})
    }


    //Extraer el proyecto y comprobar si existe

    const {proyecto} = req.body

    try{

        const proyectoTarea = await Proyecto.findById(proyecto)
        if(!proyectoTarea){
            return res.status(404).json({mgs:"Proyecto no encontrado"})
        }

        //Revizar si el proyecto actual pertenece al usuario autenticado
        if(proyectoTarea.creador.toString() !== req.usuario.id){
            return res.status(401).json({mgs:"No autorizado"})
        }

        //crear tarea
        const tarea = new Tarea(req.body)
        await tarea.save();

        res.status(200).json(tarea)

    }catch(error){
        console.log(error)
        res.status(500).send("error en el servidor")
    }

}

//obtener tareas

exports.obtenerTareas = async (req, res) => {

    //Extraer el proyecto y comprobar si existe

    const {proyecto} = req.query
    
    try{

        const proyectoTarea = await Proyecto.findById(proyecto)
        if(!proyectoTarea){
            return res.status(404).json({mgs:"Proyecto no encontrado"})
        }

        //Revizar si el proyecto actual pertenece al usuario autenticado
        if(proyectoTarea.creador.toString() !== req.usuario.id){
            return res.status(401).json({mgs:"No autorizado"})
        }


        const tareas = await Tarea.find({proyecto : proyecto}).sort({creador:-1});
        res.status(200).json(tareas);
    }catch(error){
        console.log(error);
        res.status(500).json({mgs:"Hubo un error"});
    }
}

//editar tarea

exports.actualizarTarea = async (req, res) => {

    //verificar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores : errores.array()})
    }

    const {nombre, estado} = req.body;
    let nuevaTarea = {};

        nuevaTarea.nombre = nombre
        nuevaTarea.estado = estado

    try{
        //extraer la tarea
        let tarea = await Tarea.findById(req.params.id)

        //revizar si existe la tarea
        if(!tarea){
            return res.status(404).json({mgs:"No se encontro la tarea"})
        }

        console.log(estado)
        console.log(tarea.estado)

        //extraer el proyecto y comprobar si existe
        const proyecto = await Proyecto.findById(tarea.proyecto)
        if(!proyecto){
            return res.status(404).json({mgs:"Proyecto no encontrado"})
        }

        //comprobamos la autoria del proyecto por parte del usuario
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({mgs:'No autorizado'})
        }

        //actualizamos la tarea
        tarea = await Tarea.findOneAndUpdate({_id : req.params.id}, {$set : nuevaTarea}, {new : true});

        res.status(200).json(tarea)

    }catch(error){
        console.log(error)
        res.status(500).json({mgs:'error en el servidor'})
    }
}

// Eliminar una tarea

exports.eliminarTarea = async (req, res) => {

    try{

        let tarea = await Tarea.findById(req.params.id);

        //Validar la tarea
        if(!tarea){
            res.status(404).json({mgs:"No se encontro la tarea"})
        }

        let proyectoActual = await Proyecto.findById(tarea.proyecto)

        //verificar si el proyecto Existe o no
        if(!proyectoActual){
            return res.status(404).json({mgs:"Proyecto no encontrado"})
         }
 
         //verificar el creador del proyecto
         if(proyectoActual.creador.toString() !== req.usuario.id){
             return res.status(401).json({mgs:"No estas autorizado"})
         }
 
         //borrar la tarea
         await Tarea.findOneAndRemove({_id : req.params.id});
         res.status(200).json({mgs:"Tarea eliminada"})
 
    }catch(error){
        console.log(error)
        res.status(500).json({mgs:"Hubo un error"})
    }
}