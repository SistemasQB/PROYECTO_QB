import manejadorErrores from "../middleware/manejadorErrores.js";
import barrilmodelosServicioCliente from "../models/servicioCliente/barrilModelosServicioCliente.js";
import sequelizeClase from "../public/clases/sequelize_clase.js";
import modelosInfraestructura from "../models/infraestructura/barril_modelo_compras.js";
import { Op } from "sequelize";

const controllerRentabilidad = {}

controllerRentabilidad.controlProyectos = async(req, res) => {
    try {
        let clase = new sequelizeClase({modelo: barrilmodelosServicioCliente.modelo_registroHorasCobro})
        const ahora = new Date();
        const proyectos = await clase.obtenerDatosPorCriterio({criterio: {fecha:{[Op.between]: [new Date(ahora.getFullYear(), 0, 1), new Date(ahora.getFullYear()+1, 0, 1)]}}, atributos: [
            'id','fecha','fechaCotizacion', 'cliente', 'gasto', 'horas', 'planta', 'responsable', 'region','estatus','semana', 'cotizacion', 'cotizadora', 'gastoCotizado', 'moneda', 'costo']
        })
        const cotizaciones = proyectos.map((proyecto)=>{
            if(proyecto.cotizacion) return proyecto.cotizacion.toUpperCase()
        }).filter(Boolean);
        clase = new sequelizeClase({modelo: modelosInfraestructura.modelo_requisiciones})
        const gastos = await clase.obtenerDatosPorCriterio({criterio: {
            [Op.and]:[{orden:{[Op.in] : cotizaciones}},
                    {horaRegistro:{[Op.between]: [new Date(ahora.getFullYear(), 0, 1), new Date(ahora.getFullYear(), 12, 31)]}}]
            }, atributos: ['orden', 'total']
        })
        return res.render('admin/rentabilidad/controlProyectos.ejs',{proyectos:proyectos,gastos:gastos, tok: req.csrfToken()})
    } catch (error) {
        console.log(error)
        manejadorErrores(res,error)
    }
}

export default controllerRentabilidad