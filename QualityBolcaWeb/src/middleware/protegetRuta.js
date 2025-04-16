import jwt from "jsonwebtoken";
import { Usuario } from '../models/index.js';

// import { Usuario } from "../models/index.js";


const protegerRuta = async(req, res, next) =>{
    // sessionStorage.setItem('comprobacion','12');
    //Verificar si hay un tok<en
    const { _token } = req.cookies
    // console.log(req.cookies);
    
    if(!_token){
        // console.log('no hay token');
        
        return res.redirect('/')
    }
    
    //Comprobar el token

    try {
        
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.codigoempleado)
        // console.log(decoded);001

        //Almacenar el usuario al Req
        if (usuario) {
            req.usuario = usuario
        } else {
            // console.log('no hay usuario');
            
            return res.redirect('/')
        }
        return next();

    } catch (error) {
        // console.log('no se pudo verificar el token');
        
        return res.clearCookie('_token').redirect('/')
    }


    next();
}

export default protegerRuta