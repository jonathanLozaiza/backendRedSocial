const express = require('express')
const Proyecto = require('../models/Proyecto')
const {validationResult} = require("express-validator");

//crear proyectos
exports.crearProyecto = async (req, res) => {
    
    //validar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({errores : errores.array()})
    }

    try{    
        //crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        //Guardar el proyecto
        proyecto.save();
        res.json(proyecto);

    }catch(error){
        console.log(error);
        res.status(500).json({mgs:"Hubo un error"})
    }
}

//Obtiene todos los proyectos del estado actual
exports.obtenerProyectos = async (req, res) => {
    try{
        const proyectos = await Proyecto.find({creador:req.usuario.id}).sort({creador:-1});
        res.status(200).json(proyectos);
    }catch(error){
        console.log(error);
        res.status(500).json({mgs:"Hubo un error"});
    }
}


//Actualiza los proyectos
exports.actualizarProyecto = async (req, res) => {

    //validar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({errores : errores.array()})
    }

    //extraer la informacion del proyecto

    const {nombre} = req.body
    const nuevoProyecto = {}

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try{

        //Revizar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //Si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({mgs:"Proyecto no encontrado"});
        }

        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({mgs:"No estas autorizado"});
        }

        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true});

        res.status(200).json({proyecto})
    }catch(error){
        console.log(error);
        res.status(500).json({mgs:"Hubo un error"})
    }
}

//eliminar proyecto

exports.eliminarProyecto = async (req, res) => {
    try{
        //revizar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //verificar si el proyecto Existe o no
        if(!proyecto){
           return res.status(404).json({mgs:"Proyecto no encontrado"})   
        }

        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({mgs:"No estas autorizado"})
        }

        //borrar el proyecto
        await Proyecto.findOneAndRemove({_id : req.params.id});
        res.status(200).json({mgs:"Proyecto eliminado"})

    }catch(error){
        console.log(error);
        res.staus(500).send("Error en el servidor")
    }
}