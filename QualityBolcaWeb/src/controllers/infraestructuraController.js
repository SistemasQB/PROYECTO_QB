import sequelizeClase from "../public/clases/sequelize_clase.js";
import modelosInfraestructura from "../models/infraestructura/barril_modelo_compras.js";
import envioOC from "../public/scripts/infraestructura/funciones/envioOrdenCompra.js";
import { Op, Sequelize } from "sequelize";



const infraestructuraController = {}
//controlador de inicio
infraestructuraController.inicio = (req, res)=>{
    try{
        res.render('admin/infraestructura/inicio_infraestructura.ejs')
    }
    catch(ex){
        const statusCode = ex.status || ex.statusCode || 500; // Usa el código si existe, si no, 500 por defecto
        return res.status(statusCode).render('admin/default/vista_error.ejs', {
        error: {
            mensaje: ex.message,
            stack: ex.stack,
            codigo: statusCode
        }
    });
    }
    
}
//controlador de compras
infraestructuraController.controlInventario = (req, res)=>{
    try{
        res.render('admin/infraestructura/control_de_inventario.ejs')
    }
    catch(ex){

    }
    
}
infraestructuraController.ordenCompra = async (req, res)=>{
    try{
        const tok = req.csrfToken();
        const clase = new sequelizeClase({modelo:modelosInfraestructura.modeloProveedoresOrdenesCompra})
        let criterios = {id:{[Op.gt]: 0}}
        const proveedores = await clase.obtenerDatosPorCriterio({criterio:criterios})
        res.render('admin/infraestructura/ordenCompra.ejs', {proveedores: proveedores, tok:tok})
    }catch(ex){
        res.send(`algo salio muy mal, error: ${ex}`)    
    }
    
};

infraestructuraController.historicoOrdenes = async(req, res)=>{
    try {
        let tok = req.csrfToken()
        const clase = new sequelizeClase({modelo: modelosInfraestructura.modeloOrdenCompra})
        const criterios = {status:{[Op.ne]: 'ENVIADA'}}
        let ordenes = await clase.obtenerDatosPorCriterio({criterio: criterios})
        res.render('admin/infraestructura/historico_ordenes_compra.ejs', {ordenes: ordenes, tok: tok})
    }catch (ex){
        const statusCode = ex.status || ex.statusCode || 500; // Usa el código si existe, si no, 500 por defecto
        return res.status(statusCode).render('admin/default/vista_error.ejs', {
        error: {
            mensaje: ex.message,
            stack: ex.stack,
            codigo: statusCode
        }
    });
    }
}
infraestructuraController.crudOrdenesCompra = async(req, res)=>{
    try {
        const {tipo} = req.body
        if(!tipo) return res.json({ok:false, msg:'no se especifico el tipo de accion'})
        const clase = new sequelizeClase({modelo: modelosInfraestructura.modeloOrdenCompra})
        let {id} = req.body || 0;
            switch (tipo){
                case 'insert':
                    let campitos = req.body
                    delete campitos._csrf
                    delete campitos.tipo
                    let respuesta = await clase.insertar({datosInsertar: campitos})
                    if (respuesta) return res.json({ok:respuesta, msg:'informacion almacenada con exito'})
                    return res.json({ok:false, msg:'no se pudo guardar la informacion en la base de datos'})
                case 'update':
                    break;
                case 'delete':
                    let resultado = await clase.eliminar({id:id})
                    res.json({ok: resultado, msg:'exito en el proceso'})
                case 'send':
                    let campos = req.body
                    delete campos._csrf
                    delete campos.tipo
                    
                    return res.json({ok: envioOC({datos: campos}), msg:'OC enviada exitosamente'})
                    
            }    
    } catch (ex) {
        return res.json({ok:false, msg:`surgio un error no controlado:${ex}`})
    }
    
}

//rutas de logistica vehicular

infraestructuraController.checklistVehicular = async(req, res)=>{
    try{
    const tok = req.csrfToken()
    const clase = new sequelizeClase({modelo: modelosInfraestructura.modeloUnidadesLogistica})
    const criterios = {estatus:'ACTIVO'}
    const orden = [['vehiculo','ASC']]
    let unidades = await clase.obtenerDatosPorCriterio({criterio: criterios, ordenamiento: orden})
    return res.render('admin/infraestructura/check_list_vehicular.ejs', {unidades: unidades, tok:tok})
    }catch(ex){
        
        const statusCode = ex.status || ex.statusCode || 500; // Usa el código si existe, si no, 500 por defecto
        return res.status(statusCode).render('admin/default/vista_error.ejs', {
        error: {
            mensaje: ex.message,
            stack: ex.stack,
            codigo: statusCode
        }
    });
    }
    

}

infraestructuraController.crudCheckListVehicular = async(req, res)=>{
    try{
        let clase = new sequelizeClase({modelo:modelosInfraestructura.modeloCheckListVehicular})
    let {tipo}= req.body
    switch (tipo){
    case 'insert':
        let archivos = req.files
        let datos = req.body
        delete datos.tipo
        delete datos._csrf
        Object.entries(datos).forEach(([key, value]) => {
            try {
                let parseo = JSON.parse(value)
                if(typeof parseo === 'object'){
                    datos[key] = parseo
                }    
            } catch (error) {

            }
            
        });
        
        if (archivos.length > 0){
            datos.evidencias = []
            archivos.map((file) => {
                datos.evidencias.push(file.filename)
            })
        }
        
        let mi = await clase.insertar({datosInsertar: datos})
        return res.json({ok:mi, msg:'informacion guarda con exito'})
    case 'delete':
        break;
    case 'update':
        let {id} = req.body
        let camp = req.body
        delete camp._csrf
        delete camp.tipo
        delete camp.id
            Object.entries(camp).forEach(([c, value]) => {    
                    try {
                        let par = JSON.parse(value)
                        if(typeof par === 'object'){
                            camp[c] = par
                        }
                    } catch (error) {
                        
                    }
                }
            )
        return res.json({ok: await clase.actualizarDatos({id:id, datos:camp})})
    }
    }catch(ex){
        const statusCode = ex.status || ex.statusCode || 500; // Usa el código si existe, si no, 500 por defecto
        return res.status(statusCode).render('admin/default/vista_error.ejs', {
        error: {
            mensaje: ex.message,
            stack: ex.stack,
            codigo: statusCode
        }
    });
    }
    
}

infraestructuraController.vistaCheckListVehicular = async(req, res)=>{
 try {
    let {id} = req.params
    let clase = new sequelizeClase({modelo: modelosInfraestructura.modeloCheckListVehicular})
    let resultado = await clase.obtener1Registro({id:id})
    res.render('admin/infraestructura/logistica_vehicular/formato_check_list_vehicular.ejs', {resultado})
 } catch (error) {
    
 }   
}

infraestructuraController.historicoCheckListVehicular = async(req, res)=>{
    try {
        const tok = req.csrfToken()
        let clase = new sequelizeClase({modelo: modelosInfraestructura.modeloCheckListVehicular})
        let criterios = {estatus: {[Op.ne]: ''}};
        let lista = await clase.obtenerDatosPorCriterio({criterio: criterios})
        res.render('admin/infraestructura/logistica_vehicular/historico_check_list_vehicular.ejs',{
            checks: lista,
            tok: tok
        })    
    } catch (ex) {
        const statusCode = ex.status || ex.statusCode || 500; // Usa el código si existe, si no, 500 por defecto
        return res.status(statusCode).render('admin/default/vista_error.ejs', {
        error: {
            mensaje: ex.message,
            stack: ex.stack,
            codigo: statusCode
            }
        })
    
    
    }
}
export default infraestructuraController;
