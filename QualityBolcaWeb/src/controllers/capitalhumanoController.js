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

const CAMPO_ORDEN = {
    plantas:                   'nombre_planta',
    departamentos:             'nombre_departamento',
    puestos:                   'nombre_puesto',
    regiones:                  'nombre_region',
    escolaridades:             'nombre_escolaridad',
    tipos_contratacion:        'descripcion',
    motivos_baja:              'descripcion_baja',
    infonavit_tipos_descuento: 'descripcion_descuento',
}

controlador.catalogos = async(req, res) => {
    try{
        const nombre = req.body.catalogo
        const campo  = CAMPO_ORDEN[nombre]
        const modelo = capitalHumano[nombre]

        if (!campo || !modelo) {
            return res.status(400).json({token: req.csrfToken(), ok: false, msg: `Catálogo "${nombre}" no reconocido`})
        }

        const clase = new sequelizeClase({modelo})
        const resultado = await clase.obtenerDatosPorCriterio({
            criterio:     {id: {[Op.gt]: 0}},
            ordenamiento: [campo, 'ASC'],
        })
        return res.status(200).json({token: req.csrfToken(), data: resultado, ok: true, msg: 'Catálogo cargado correctamente'})
    }catch(error){
        console.error('Error en controlador.catalogos:', error);
        return res.status(500).json({token: req.csrfToken(), ok: false, msg: 'Error al cargar el catálogo' });
    }
}
export default controlador;