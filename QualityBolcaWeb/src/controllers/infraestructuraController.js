import sequelizeClase from "../public/clases/sequelize_clase.js";
import modelosInfraestructura from "../models/infraestructura/barril_modelo_compras.js";
import modelosGenerales from "../models/generales/barrilModelosGenerales.js";
import envioOC from "../public/scripts/infraestructura/funciones/envioOrdenCompra.js";
import { Op} from "sequelize";
import manejadorErrores from "../middleware/manejadorErrores.js";



const infraestructuraController = {}
//controlador de inicio
infraestructuraController.inicio = (req, res)=>{
    try{
        return res.render('admin/infraestructura/inicio_infraestructura.ejs')
    }
    catch(ex){
        manejadorErrores(res,ex)
    }
    
}

//controlador de control de inventario
infraestructuraController.controlInventario = (req, res)=>{
    try{
        res.render('admin/infraestructura/control_de_inventario.ejs')
    }
    catch(ex){
        manejadorErrores(res,ex)
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
        manejadorErrores(res,ex)
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
        manejadorErrores(res,ex)
    }
}
infraestructuraController.crudOrdenesCompra = async(req, res)=>{
    try {
        const {tipo} = req.body
        if(!tipo) return res.json({ok:false, msg:'no se especifico el tipo de accion'})
        const clase = new sequelizeClase({modelo: modelosInfraestructura.modeloOrdenCompra})
        let {id} = req.body || 0;
        let servicios
        let partidas
            switch (tipo){
                case 'insert':
                    let campitos = req.body
                    delete campitos._csrf
                    delete campitos.tipo
                        servicios = JSON.parse(campitos.servicios)
                        partidas = JSON.parse(servicios.partidas)
                        servicios.partidas = partidas
                        campitos.servicios = servicios
                        campitos.informacionProveedor = JSON.parse(campitos.informacionProveedor)
                    let respuesta = await clase.insertar({datosInsertar: campitos})
                    if (respuesta) return res.json({ok:respuesta, msg:'informacion almacenada con exito'})
                    return res.json({ok:false, msg:'no se pudo guardar la informacion en la base de datos'})
                case 'update':
                    let datos = req.body
                    delete datos._csrf
                    delete datos.tipo
                    delete datos.id
                    delete datos._csrf
                    servicios = JSON.parse(datos.servicios)
                    partidas = servicios.partidas
                        servicios.partidas = partidas
                        datos.servicios = servicios
                    return res.json({ok: await clase.actualizarDatos({id:id, datos: datos, msg: ''})})
                case 'delete':
                    let resultado = await clase.eliminar({id:id})
                    return res.json({ok: resultado, msg:'exito en el proceso'})
                case 'send':
                    let campos = req.body
                    delete campos._csrf
                    delete campos.tipo
                    let envio = await clase.actualizarDatos({id:id, datos:{status: 'ENVIADA'}})
                    if (!envio) return res.json({ok:envio, msg:'no se pudo actualizar la OC'})
                    delete campos.id
                    return res.json({ok: envioOC({datos: campos}), msg:'OC enviada exitosamente'})
            }    
    } catch (ex) {
        manejadorErrores(res,ex)
    }
    
}

//controladores de pedidos de insumos
infraestructuraController.pedidoInsumos = async(req, res) => {
    try {
        let tok = req.csrfToken()
        let clase = new sequelizeClase({modelo: modelosInfraestructura.modeloComprasInventario})
        let criterios = {estatus: {[Op.ne]: 'NO ACTIVO'}}
        let productos = await clase.obtenerDatosPorCriterio({criterio:criterios})
        clase = new sequelizeClase({modelo: modelosInfraestructura.modelo_plantas_gastos})
        criterios = {id:{[Op.gt]:0}}
        let plantas = await clase.obtenerDatosPorCriterio({criterio: criterios})    
        return res.render('admin/infraestructura/formato_pedido_insumos.ejs',{
            productos: productos, 
            plantas: plantas,
            tok: tok
        })    
    } catch (ex) {
        manejadorErrores(res,ex)
    }
}
infraestructuraController.crudPedidoInsumos = async(req, res) => {
    try {
        let campos = req.body
        delete campos._csrf
        let usuario = req.usuario.codigoempleado
        let clase = new sequelizeClase({modelo: modelosGenerales.modelonom10001})
        let datosUsuario =  await clase.obtener1Registro({criterio:{codigoempleado:usuario}})
        clase = new sequelizeClase({modelo: modelosInfraestructura.modelo_pedido_insumos})
        switch(campos.tipo){
            case 'insert':
                campos.solicitante = datosUsuario.nombrelargo
                return res.json({ok:  await clase.insertar({datosInsertar: campos}), msg: 'informacion enviada exitosamente'})
            case 'update':
                
                return res.json({ok:  await clase.actualizarDatos({id: campos.id, datos: campos}), msg: 'informacion actualizada exitosamente'})
            case 'delete':
                break;
        }    
    } catch (error) {
        manejadorErrores(res,ex)
    }
    
}

infraestructuraController.gestionPedidosInsumos = async(req, res) => {
    try {
        let clase = new sequelizeClase({modelo: modelosInfraestructura.modelo_pedido_insumos})
        let resultados = await clase.obtenerDatosPorCriterio({criterio:{estatus: 'PENDIENTE'}})
        clase = new sequelizeClase({modelo: modelosInfraestructura.modeloComprasInventario})
        let criterios = {estatus: {[Op.ne]: 'NO ACTIVO'}}
        let productos = await clase.obtenerDatosPorCriterio({criterio:criterios})
        let usuario = req.usuario.codigoempleado
        clase = new sequelizeClase({modelo: modelosGenerales.modelonom10001})
        let datosUsuario =  await clase.obtener1Registro({criterio:{codigoempleado:usuario}})
        return res.render('admin/infraestructura/gestionPedidosInsumos.ejs', {pendientes: resultados, productos: productos, usuario: datosUsuario.nombrelargo, tok: req.csrfToken()})
    } catch (error) {
        manejadorErrores(res,ex)
    }
        
}


//controladores de logistica vehicular

infraestructuraController.checklistVehicular = async(req, res)=>{
    try{
    const tok = req.csrfToken()
    const clase = new sequelizeClase({modelo: modelosInfraestructura.modeloUnidadesLogistica})
    const criterios = {estatus:'ACTIVO'}
    const orden = [['vehiculo','ASC']]
    let unidades = await clase.obtenerDatosPorCriterio({criterio: criterios, ordenamiento: orden})
    return res.render('admin/infraestructura/check_list_vehicular.ejs', {unidades: unidades, tok:tok})
    }catch(ex){
        manejadorErrores(res,ex)   
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
        manejadorErrores(res,ex)   
    }
    
}

infraestructuraController.vistaCheckListVehicular = async(req, res)=>{
 try {
    let {id} = req.params
    let clase = new sequelizeClase({modelo: modelosInfraestructura.modeloCheckListVehicular})
    let resultado = await clase.obtener1Registro({id:id})
    res.render('admin/infraestructura/logistica_vehicular/formato_check_list_vehicular.ejs', {resultado})
 } catch (error) {
    manejadorErrores(res,ex)   
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
        manejadorErrores(res,ex)   
    }
}
export default infraestructuraController;