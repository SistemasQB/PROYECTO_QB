import jwt from "jsonwebtoken";
import { Usuario } from '../models/index.js';

// import { Usuario } from "../models/index.js";


const comprobarPuesto = async(req, res, next) =>{

    //Verificar si hay un tok<en

    const direccion = req.baseUrl
    
    const { _token } = req.cookies
    if(!_token){
        return res.redirect('/')
    }
    //Comprobar el token

    try {
        
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)

        //Almacenar el usuario al Req
        if (usuario) {
            req.usuario = usuario
        } else {
            return res.redirect('/')
        }
        return next();
    } catch (erro) {
        return res.clearCookie('_token').redirect('/')
    }


    next();
}

export default comprobarPuesto