import sequelizeClase from "../public/clases/sequelize_clase.js";
import modelosGenerales from "../models/generales/barrilModelosGenerales.js";
import manejadorErrores from "../middleware/manejadorErrores.js";
import { Op } from "sequelize";
//importacion de modelos de capturacion.

let controlador = {};
controlador.inicio = (req, res) => {
    res.render('admin/capturacion/inicio.ejs');
}
controlador.listado = (req, res) => { //muestra listado de capturacion
    try {
        res.render('admin/capturacion/listado.ejs');    
    } catch (error) {
        
    }
    
}

controlador.controlRegiones = async (req,res) => {
    try {
        let clase = new sequelizeClase({modelo: modelosGenerales.vistaempleados});
        const caps = await clase.obtenerDatosPorCriterio({criterio: {departamentoLocal: 'CAPTURACION' }}); //obtencion de capturistas
        const codigosEmpleados = caps.map(capturista => capturista.codigoempleado);
        clase = new sequelizeClase({modelo: modelosGenerales.usuarios});
        const permisos = await clase.obtenerDatosPorCriterio({criterio: {codigoempleado: {[Op.in]:[codigosEmpleados]}}, atributos: ['codigoempleado', 'permisos']});//obtencion de permisos
        let capturistas = [];
        permisos.forEach(e => {
            e.permisos = JSON.parse(e.permisos);    
            const cap2  = caps.find(c => c.codigoempleado == e.codigoempleado);
            const cap = cap2.toJSON()
            if(cap){ 
                cap.name = cap.apellidopaterno + ' ' + cap.apellidomaterno + ' ' + cap.nombre;
                delete cap.apellidopaterno;
                delete cap.apellidomaterno;
                delete cap.departamento
                delete cap.nombre                
                cap.permisosCaptura = e.permisos.permisosCaptura || [];
                capturistas.push(cap); 
            }
        });
        return res.render('admin/capturacion/permisosCaptura.ejs', {capturistas, token: req.csrfToken()});
    } catch (error) {
        manejadorErrores(res, error);  
    }
}

controlador.crudPermisos = async(req, res) => {
    try {
        const {id} = req.body
        let clase = new sequelizeClase({modelo: modelosGenerales.usuarios});
        switch (req.body.tipo){
        case 'insert':
                break;
        case 'update':
                const usuario = await clase.obtener1Registro({criterio:{codigoempleado: req.body.codigoCapturista}, atributos : ['codigoempleado','permisos']});
                let permisos = JSON.parse(usuario.permisos);
                permisos.permisosCaptura = req.body.permisosCaptura;
                const actualizacion = await clase.ejecutarQuery({query:'update usuarios set permisos = :permisos where codigoempleado = :codigoempleado', 
                    replacements:{permisos, codigoempleado: req.body.codigoCapturista}, mapToModel:true});
                if(!actualizacion) return res.json({ok: false, msg: 'no se pudo actualizar los permisos', token: req.csrfToken()});
                return res.json({ok: true, msg: 'los permisos fueron actualizados exitosamente', token: req.csrfToken()});
        case 'delete':
            break;
        }    
    } catch (error) {
        console.log(error);
    }
    
}

export default controlador;