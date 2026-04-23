import manejadorErrores from '../middleware/manejadorErrores.js';
import sequelizeClase from '../public/clases/sequelize_clase.js';
import {capitalHumano} from '../models/QBnew/catalogos/barrilCatalogos.js';
import { Op } from 'sequelize';

let controlador = {}
controlador.inicio = (req, res) => {
    try{
        return res.render("admin/capitalhumano/inicioCapitalHumano.ejs", { token: req.csrfToken()});
    }catch(error){
        console.error('Error en controlador.inicio:', error);
        return manejadorErrores(res, 'Error al cargar la página de inicio de Capital Humano');
        
    }
}

controlador.catalogos = async(req, res) => {
    try{
        let resultado = null;
        let clase = new sequelizeClase({modelo: capitalHumano[req.body.catalogo]});
        switch(req.body.catalogo){
            case 'plantas':
                resultado = await clase.obtenerDatosPorCriterio({criterio: {id: { [Op.gt]: 0 }}, orden: ['nombre_planta', 'ASC'] } );
                return res.status(200).json({token: req.csrfToken(), data: resultado, ok: true, msg: "Catálogo cargado correctamente",});
            case 'departamentos':
                resultado = await clase.obtenerDatosPorCriterio({criterio: {id: { [Op.gt]: 0 }}, orden: ['nombre_departamento', 'ASC'] } );
                return res.status(200).json({token: req.csrfToken(), data: resultado, ok: true, msg: "Catálogo cargado correctamente",});
            
        }
        console.log("no entro al switch");
    }catch(error){
        console.error('Error en controlador.catalogos:', error);
        return res.status(500).json({token: req.csrfToken(), ok: false, msg: 'Error al cargar el catálogo' });
    }
}
export default controlador;