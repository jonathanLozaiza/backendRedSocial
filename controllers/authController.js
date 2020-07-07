const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const {validationResult} = require("express-validator");
const jwt = require('jsonwebtoken');


exports.autenticarUsuarios = async (req, res) => {

    //validar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){return res.status(400).json({errores : errores.array()})}

    //extraer el email y password
    const {email, password} = req.body;

    try{
        let usuario = await Usuario.findOne({email});

        // Revizar si existe el usuario
        if(!usuario){
            return res.status(400).json({msg:"El usuario no existe"});
        }

        //Revizar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg: "El password es incorrecto"})
        }

        //crear y firmar el JWT
        const payload = {
            user : {id : usuario.id}
        }

        //firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn : 3600000
        }, (error, token) => {
            if(error) throw error;

            //mensaje de confirmacion (cuando llave y valor tienen el mismo nombre se puede solo colocar el valor)
            res.json({token})

        })

    }catch(error){
        console.log(error)
    }


}

// Obtiene que usuario esta registrado
exports.usuarioAutenticado = async (req, res) => {

    try{
        const usuario = await Usuario.findById(req.usuario.id).select('-password')
        res.json({usuario})
    }catch(error){
        console.log(error)
        res.status(500).json({msg:'Hubo un error'})
    }
}