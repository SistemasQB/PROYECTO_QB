import jwt from "jsonwebtoken";
import  modeloUsuario  from '../models/generales/modelo_usuarios.js';

const rutasPublicas = async(req, res, next) =>{
    //Verificar si hay un token
    const { _token } = req.cookies
    if(!_token){
        return next();
    }
    //Comprobar el token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const usuario = await modeloUsuario.scope('eliminarPassword').findByPk(decoded.codigoempleado)
        //Almacenar el usuario al Req
        if (usuario) {
            if (req.path === '/' || req.path === '/login')  {
                return res.redirect('/inicio');
            }
        }
        return next();
    } catch (error) {
        return next();
    }
    next();
}

export default rutasPublicas;