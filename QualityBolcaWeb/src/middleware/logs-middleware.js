import modelosGenerales from "../models/generales/barrilModelosGenerales.js";
import sequelizeClase from "../public/clases/sequelize_clase.js";

const logsMiddleware = async (req, res, next, exception) => {
    try {
        let datos = {ip  : req.ip, url  : req.url, metodo  : req.method}
        datos.exception = exception
        const usuario = req.usuario;
        let clase = new sequelizeClase({ modelo: modelosGenerales.modelonom10001 });
        datos.usuario = await clase.obtener1Registro({ criterio: { codigoempleado: req.usuario.codigoempleado } }, atributos = ['nombrelargo']);
        clase = new sequelizeClase({ modelo: modelosGenerales.LogsSistemas });
        await clase.insertarDatos({datos});
        next();
    } catch (error) {
        console.log(error);
    }
}

export default logsMiddleware