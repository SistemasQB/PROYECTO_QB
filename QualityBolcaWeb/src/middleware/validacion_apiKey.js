import bcrypt from 'bcrypt' 
import sequelizeClase from '../public/clases/sequelize_clase.js'
import modelosGenerales from '../models/generales/barrilModelosGenerales.js'

const validarApiKey =  (req, res, next) => {
    const apiKey = req.headers['x-api-key']
    console.log(apiKey); 
    if (!apiKey) {
        return res.status(401).json({ok:false, msg: 'No se proporcionó una API key válida.'});
    }
    const clase = new sequelizeClase({modelo: modelosGenerales.api_keys})
    clase.obtener1Registro({criterio: {usuario: 11379}}).then((api_key) => { //se debe de cambiar el 11379 por el id del usuario con req.usuario.numeroempleado
        if (!api_key) {
            return res.status(401).json({ok:false, msg: 'La API key proporcionada no es válida 1.'});
        }
            bcrypt.compare(apiKey, api_key.key).then((result) => {
                if (result) {
                    next();
                } else {
                    return res.status(401).json({ok:false, msg: 'La API key proporcionada no es válida. 2'});
                }
            })
    }).catch((error) => {
        return res.status(401).json({ok:false, msg: `hubo un problema con el procedimiento de la api key: ${error}`});
    })
}
export default validarApiKey;