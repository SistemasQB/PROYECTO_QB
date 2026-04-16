import sequelizeClase from "../public/clases/sequelize_clase.js";
import modelosgenerales from "../models/generales/barrilModelosGenerales.js";
import manejadorErrores from "../middleware/manejadorErrores.js";
import customFunctions from "../js/funcionesBackend.js";
import env from "dotenv";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// import modelosSorteo from "../models/sorteo/barrilModelosSorteo.js";
import modelosSorteo from "../models/sorteo/barrilModelosSorteo.js";
const { modeloEdgewell } = modelosSorteo
import { Op } from 'sequelize'
const controller = {};
env.config({ path: ".env" });

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

controller.inicio = (req, res)=>{
    res.render('admin/sorteo/inicio.ejs')
}
//controlador de entrega de material (cliente) ----------------------------------------------------------
controller.entregaMaterial = async (req, res)=>{
    let token = req.csrfToken()
    let clase = new sequelizeClase({modelo: modelosSorteo.modeloNuevoMaterial})
    // res.render('admin/sorteo/formulario-entrega-material.ejs', {tok: token})
    let orden = [['numeroParte','ASC']]
    let productos = await clase.obtenerDatosPorCriterio({criterio: {id: {[Op.gt]: 0}}, ordenamiento: orden})
    res.render('admin/sorteo/formato-edgewell.ejs', {tok:token, productos: productos})
}

controller.adminEntregaMaterial = async (req, res)=>{
    let tok = req.csrfToken();
    let fecha =  new Date(Date.now());
    let mes = fecha.getMonth();
    let dia,  ano 
    dia = fecha.getDay()
    ano = fecha.getFullYear()
    let fi = new Date(`${ano}-${mes-1}-${dia}`)
    fecha = `${ano}-${mes}-${dia + 1}`
    let clase = new sequelizeClase({modelo: modeloEdgewell});
    let criterios = {[Op.and]:[
        {fecha:{[Op.between]: [fi, fecha]}},
        {estatus:'ENVIADO'}
    ]}
    let resultados = await clase.obtenerDatosPorCriterio({criterio: criterios})
    res.render('admin/sorteo/admin_entrega_material.ejs', {embarques:resultados, tok:tok})
}

controller.envioMaterial = async (req, res)=>{
    let archivos = req.files
    if(!archivos) return res.json({ok:false, msg: "no se subieron las imagenes"});
    let datos = req.body
    delete datos._csrf
    let firmas = {}
    
    archivos.forEach((archivo) =>{
        if(archivo.originalname.includes('firma entrega')){
            firmas.entrega = archivo.filename
        }else if(archivo.originalname.includes('firma recibe')){
            firmas.recibe = archivo.filename
        }else{
            datos.imagenEmbarque = archivo.filename
        }
    });
    datos.firmas = firmas
    datos.partidas = JSON.parse(datos.partidas)
    datos.resumen = JSON.parse(datos.resumen)
    const seq = new sequelizeClase({modelo: modeloEdgewell})
    try{
        let actualizacion = await seq.insertar({datosInsertar: datos})
       if (actualizacion){
        return res.json({ok:true, msg: "informacion enviada exitosamente"})
       }

    }catch(ex){
        return res.json({msg: `error interno del server. Error: ${ex}`, ok: false})
    }
}

controller.adminAlmacen = async (req, res)=>{
    try{
        let tok = req.csrfToken();
        let fecha =  new Date(Date.now());
        let mes = fecha.getMonth();
        let dia, mesi, ano 
        dia = fecha.getDay()
        mesi = fecha.getMonth()
        ano = fecha.getFullYear()
        let fi = new Date(`${ano}-${mes-1}-${dia}`)
        
        fecha = `${ano}-${mesi}-${dia+1}`
        let clase = new sequelizeClase({modelo: modeloEdgewell});
        let criterios = {[Op.and]:[
            {fecha:{[Op.between]: [fi, fecha]}},
            {estatus:'ENVIADO'}
        ]}
        let embarques = await clase.obtenerDatosPorCriterio({criterio: criterios})
        res.render('admin/sorteo/inicio_almacen.ejs', {embarques: embarques, tok: tok})
    }
    catch (ex ){
        console.error(ex);
    }
}

controller.puntoEntrada = async (req, res)=>{
    let tok = req.csrfToken()
    let id = req.params.id;
    let clase = new sequelizeClase({modelo: modelosSorteo.modeloEdgewell})
    let criterios = {id:id}
    let embarquito = await clase.obtener1Registro({criterio :criterios})
    return res.render('admin/sorteo/formulario_ingreso_almacen.ejs', {embarque: embarquito, tok:tok})
}

controller.prueba = (req, res)=>{
    let tok = req.csrfToken()
    res.render('admin/sorteo/formulario-entrega-material.ejs', {tok:tok})
}

controller.output = async(req,res) => {
    try {
        let clase = new sequelizeClase({modelo: modelosgenerales.modelonom10001 });
        const datosUsuario = await clase.obtener1Registro({criterio:{codigoempleado: req.usuario.codigoempleado}, atributos: ['nombrelargo']});
        clase = new sequelizeClase({modelo: modelosSorteo.output});
        const resultados = await clase.obtenerDatosPorCriterio({criterio:{supervisor: datosUsuario.nombrelargo}});
        // const tipoCambio = 0
        let tipoCambio = await customFunctions.peticionJson('https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno',{method: 'GET', 'Bmx-Token': process.env.tokenBanxico});
        return res.render('admin/sorteo/output.ejs', {registros: resultados, token: req.csrfToken(), supervisor: datosUsuario.nombrelargo, tipoCambio});
    } catch (error) {
        manejadorErrores(res, error);
    }
}

controller.crudOutput = async(req, res) => {
    try {
        let campos = req.body;
        const clase = new sequelizeClase({modelo: modelosSorteo.output});
        const {tipo, id} = req.body
        delete campos.id
        delete campos._csrf
        delete campos.tipo
        switch(tipo){
            case 'insert':
                let respuesta = await clase.insertar({datosInsertar: campos});
                if (!respuesta) return res.json({ok: false, msg: 'no se pudo ingresar la informacion'});
                return res.json({ok: true, msg: 'informacion enviada exitosamente'});
            case 'update':
                let actualizado = await clase.actualizarDatos({id: id, datos: campos});
                if (!actualizado) return res.json({ok: false, msg: 'no se pudo actualizar la informacion'});
                return res.json({ok: true, msg: 'informacion actualizada exitosamente'});
            case 'delete':
                let eliminado = await clase.eliminar({id: id});
                if (!eliminado) return res.json({ok: false, msg: 'no se pudo eliminar la informacion'});
                return res.json({ok: true, msg: 'informacion eliminada exitosamente'});
        }
    } catch (error) {
        manejadorErrores(req, error);    
    }
}

controller.dashBoardOutput = async(req, res) => {
    try {
        const mesActual  =new Date().getMonth();
        const anioActual = new Date().getFullYear();
        const fechas = customFunctions.generarFechas(mesActual, anioActual);
        const criterios = {createdAt: {[Op.between]: [fechas.inicio, fechas.fin]}};
        const clase = new sequelizeClase({modelo: modelosSorteo.output});
        const resultados = await clase.obtenerDatosPorCriterio({criterio:criterios});
        return res.render('admin/sorteo/outputDashboard.ejs', {token: req.csrfToken(), servs: resultados});
    } catch (error) {
        console.error(error);
        manejadorErrores(res, error);
    }
    
}

controller.dashboard = (req, res) => {
    try {
        return res.status(200).render('admin/sorteo/dashboard.ejs', {token: req.csrfToken()});
    } catch (error) {
        
    }
}

export default controller;