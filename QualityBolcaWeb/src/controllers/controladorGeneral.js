
import sequelizeClase from '../public/clases/sequelize_clase.js';
import modelosGenerales from '../models/generales/barrilModelosGenerales.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

let controlador = {}
//end point de generacion de api_key
controlador.api_key = async (req, res) => {
    try {
        const key = crypto.randomBytes(32).toString('hex');
        const hasheada = await bcrypt.hash(key, 10);
        const clase = new sequelizeClase({modelo: modelosGenerales.api_keys});
        if(!await clase.insertar({datosInsertar: {key: hasheada,usuario: 11379}})) return res.json({ok: false, msg: 'No se pudo guardar la api_key'});
        return res.json({ok: true, key});
    } catch (error) {
        console.log(error)
    }
}

export default controlador;