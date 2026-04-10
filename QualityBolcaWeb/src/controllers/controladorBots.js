import sequelizeClase from '../public/clases/sequelize_clase.js';
import manejadorErrores from '../middleware/manejadorErrores.js';
const controlador = {}

controlador.botReportes = (req, res) => {
    try {
        res.render('bots/botPrueba.ejs')    
    } catch (error) {
        manejadorErrores(res, error)
    }
    
}

export default controlador