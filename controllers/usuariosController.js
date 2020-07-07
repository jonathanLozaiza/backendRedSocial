const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const {validationResult} = require("express-validator");
const jwt = require('jsonwebtoken');


exports.crearUsuario = async (req, res) => {

    //validar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){return res.status(400).json({errores : errores.array()})}

    const {email, password} = req.body;

    try{

        //Revizar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({msg: "El usuario ya existe"});
        }

        //creamos el usuario
        usuario = new Usuario(req.body);

         //Hashear el password
         const salt = await bcryptjs.genSalt(10);
         usuario.password = await bcryptjs.hash(password, salt);

        //guardar usuario
        await usuario.save();

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
        console.log(error);
        res.status(400).send("Hubo un error");
    }
}