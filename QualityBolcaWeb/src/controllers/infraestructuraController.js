import sequelizeClase from "../public/clases/sequelize_clase.js";
import modelosInfraestructura from "../models/infraestructura/barril_modelo_compras.js";
import modelosGenerales from "../models/generales/barrilModelosGenerales.js";
import { Op} from "sequelize";
import manejadorErrores from "../middleware/manejadorErrores.js";
import nodemailerClase from "../public/clases/nodemailer.js";



const infraestructuraController = {}
//controlador de inicio
infraestructuraController.inicio = (req, res)=>{
    try{
        return res.render('admin/infraestructura/inicio_Infraestructura.ejs')
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
                    let orden = await clase.obtener1Registro({criterio:{id:id}})
                    if (orden.estatus == 'ENVIADA' ) return res.json({ok:true, msg:'la OC ya habia sido enviada'})
                    delete campos.id
                    ///parseo de la informacion
                    orden.informacionProveedor = JSON.parse(orden.informacionProveedor)
                    orden.servicios = campos.servicios
                    orden.observaciones = campos.observaciones    

                    //configuracion que se debe de eliminar
                    const configuracion = new nodemailerClase({datosSmtp:{host: process.env.EMAIL_HOST, port: process.env.EMAIL_PORT, auth: {user: process.env.EMAILR_USER, pass: process.env.EMAILR_PASS,}}})
                    let confirmacion = await configuracion.enviarCorreo({Datoscorreo: {destinatario: orden.informacionProveedor.correo, asunto: `ORDEN DE COMPRA DE QUALITY BOLCA`,
                    texto: 'orden compra', html: configuracion.htmlOrdenesCompra({datos:orden}),cc:"grupo.compras@qualitybolca.com"}})
                    
                    if(!confirmacion) return res.json({ok:confirmacion, msg:'no se pudo notificar al proveedor'})
                    let envio = await clase.actualizarDatos({id: id, datos: campos})
                    if (!envio) return res.json({ok:envio, msg:'no se pudo actualizar la OC'})
                        //let envioO = envioOC({datos: orden})
                        // if (!envioO) return res.json({ok:envioO, msg:'no se pudo enviar la OC'})
                    return res.json({ok: true, msg:'OC enviada exitosamente'})
            }    
    } catch (ex) {
        console.log(ex)
        return res.json({ok: false, msg: ex, error: ex.message})
        
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
        const envio = new nodemailerClase({datosSmtp:{host: process.env.EMAIL_HOST, port: process.env.EMAIL_PORT, auth: {user: process.env.EMAILR_USER, pass: process.env.EMAILR_PASS,}}})
        let confirmacion = false
        const id = campos.id
        switch(campos.tipo){
            case 'insert':
                delete campos.tipo
                campos.solicitante = datosUsuario.nombrelargo
                let respuesta = await clase.insertar({datosInsertar: campos})
                if (!respuesta) return res.json({ok: false, msg: 'no se pudo ingresar la informacion'})
                confirmacion = await envio.enviarCorreo({Datoscorreo: {destinatario: 'grupo.compras@qualitybolca.com', asunto: `nuevo pedido de insumos de (${campos.solicitante})`, texto: 'pedido de insumos', html: envio.htmlPedidoInsumos()}})
                if (!confirmacion) return res.json({ok: true, msg: 'la requisicion se hizo, pero no se pudo notificar al area de compras'})
                    return res.json({ok:  respuesta, msg: 'informacion enviada exitosamente'})
            case 'update':
                delete campos.id
                delete campos.tipo
                const solicitante = campos.solicitante
                delete campos.solicitante
                let actualizado = await clase.actualizarDatos({id: id, datos: campos})
                if (!actualizado) return res.json({ok: false, msg: 'no se pudo actualizar la informacion'})
                clase = new sequelizeClase({modelo: modelosGenerales.modelonom10001})
                let datosSolicitante =  await clase.obtener1Registro({criterio:{nombrelargo:solicitante}})
                if (!datosSolicitante) return res.json({ok: true, msg: 'informacion actualizada exitosamente'})
                    datosSolicitante.id = id
                console.log(datosSolicitante)
                actualizado = envio.enviarCorreo({Datoscorreo: {destinatario: datosSolicitante.correoelectronico, asunto: `pedido de insumos Surtido`, texto: 'pedido surtido', html: envio.htmlConfirmacionSurtimiento(datosSolicitante)}})
                return res.json({ok:actualizado, msg: 'informacion actualizada exitosamente'})
            case 'delete':
                let eliminado = await clase.eliminar({id: id})
                if (!eliminado) return res.json({ok: false, msg: 'no se pudo eliminar la informacion'})
                return res.json({ok:eliminado, msg: 'informacion eliminada exitosamente'})
            case 'rechazo':
                delete campos.tipo
                delete campos.id
                let rechazado = await clase.actualizarDatos({id: id, datos: campos})
                if (!rechazado) return res.json({ok: false, msg: 'no se pudo rechazar la informacion'})
                return res.json({ok:rechazado, msg: 'informacion actualizada exitosamente'})
        }    
    } catch (error) {
        console.log(error)
        manejadorErrores(res,error)
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

// controladores de check list vehicular
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
            try {let parseo = JSON.parse(value)
                if(typeof parseo === 'object'){datos[key] = parseo}    
            } catch (error) {}
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
        let idE = req.body.id
        return res.json({ok: await clase.eliminar({id: idE}), msg:'informacion eliminada con exito'})
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
    let criterios = {id:parseInt(id)}
    let resultado = await clase.obtener1Registro({criterio:criterios})
    res.render('admin/infraestructura/logistica_vehicular/formato_check_list_vehicular.ejs', {resultados:resultado})
 } catch (error) {
    manejadorErrores(res,ex)   
 }   
}

infraestructuraController.historicoCheckListVehicular = async(req, res)=>{
    try {
        const tok = req.csrfToken()
        let clase = new sequelizeClase({modelo: modelosInfraestructura.modeloCheckListVehicular})
        let criterios = {estatus: {[Op.ne]: ''}};
        let atributos = ['id','datosUnidad','createdAt', 'estatus']
        let lista = await clase.obtenerDatosPorCriterio({criterio: criterios, atributos: atributos})
        return res.render('admin/infraestructura/logistica_vehicular/historico_check_list_vehicular.ejs',{
            checks: lista,
            tok: tok
        })    
    } catch (ex) {
        manejadorErrores(res,ex)   
    }
}
export default infraestructuraController;