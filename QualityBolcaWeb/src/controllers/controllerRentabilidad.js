import manejadorErrores from "../middleware/manejadorErrores.js";
import barrilmodelosServicioCliente from "../models/servicioCliente/barrilModelosServicioCliente.js";
import modelosGenrales from "../models/generales/barrilModelosGenerales.js";
import sequelizeClase from "../public/clases/sequelize_clase.js";

const controllerRentabilidad = {}

controllerRentabilidad.controlProyectos = async(req, res) => {
    try {
        let clase = new sequelizeClase({modelo: barrilmodelosServicioCliente.modelo_registroHorasCobro})
        let proyectos = await clase.obtenerDatosPorCriterio({criterio: {}, atributos: [
            'id','fecha','fechaCotizacion', 'cliente', 'gasto', 'horas', 'planta', 'responsable', 'region','estatus','semana', 'cotizacion', 'cotizadora', 'gastoCotizado']
        })
        res.render('admin/rentabilidad/controlProyectos.ejs',{proyectos: proyectos, tok: req.csrfToken()})
    } catch (error) {
        manejadorErrores(res,error)
    }
}

export default controllerRentabilidad