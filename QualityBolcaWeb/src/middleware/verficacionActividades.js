import sequelizeClase from "../public/clases/sequelize_clase";
import modeloBitacora from "../models/calidad/bitacoraActividades.js"
import { Op } from "sequelize";
async function Correos(){
    let clase = new sequelizeClase(modeloBitacora)
    let actividades = await clase.obtenerDatosPorCriterio({criterio: {[Op.and]:[
        {estatus: {[Op.ne]: 'COMPLETADA'}},
        {evaluacion: {[Op.ne]: 'RECHAZADA'}}
    ]}})
    if(!actividades){
        
    }

}

export default Correos;