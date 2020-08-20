const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    //Leer el token del header
    const token = req.header('x-auth-token')

    //Revizar si no hay token
    if(!token){
        return res.status(400).json({mgs:"No hay token, permiso no valido"});
    }

    //validar el token
    try{
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.user;
        next();
    }catch(error){
        res.status(401).json({mgs:"Token invalid"})
    }
}