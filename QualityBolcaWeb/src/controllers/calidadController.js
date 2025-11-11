import express from "express";
import Sequelize, { where } from 'sequelize'
import claseSeq from "../public/clases/sequelize_clase.js";
import { emailMejoraRespuesta } from "../helpers/emails.js";
import { Op } from 'sequelize'
import { format } from "@formkit/tempo"
import sequelizeClase from "../public/clases/sequelize_clase.js";
import barrilcalidad from '../models/calidad/barrilCalidad.js'

import {
    Mejora,
    bitacoraActividades,
    Empleados,
    modeloDirectorioCalidad
} from "../models/index.js";


const app = express();

const controller = {};

controller.verificacion5s = (req, res) => {
    res.render('admin/calidad/verificacion5s');
}

controller.verificacion5s2 = (req, res) => {
}

controller.evidencias = async (req, res) => {

    const obtenerValores = await Mejora.findAll({ where: { estatus:{ [Op.gt]: 0} }, order: [[Sequelize.literal('fecha'), 'DESC']], });

    res.render('admin/calidad/evidencias', {
        csrfToken: req.csrfToken(),
        obtenerValores
    });
}

controller.evidencias2 = async (req, res) => {

    const { mejoraid } = req.body

    const obtenerEvidencia = await Mejora.findByPk({ where: mejoraid });

    obtenerEvidencia.

    res.render('admin/calidad/evidencias', {
        csrfToken: req.csrfToken(),
        obtenerValores
    });
}

controller.mejoracontinua = async (req, res) => {
    try {
        let resultados = await Mejora.findAll({
            where: { estatus: 1 }
        })
        //TODO: posible condicionante de 0 rows
        let token = req.csrfToken()
        res.render('admin/calidad/comitemejoracontinua',
            {
                resultados,
                csrfToken: token
            }
        )
    } catch (ex) {

    };
}
controller.rechazarMejora = async (req, res) => {
    let { id, motivo } = req.body;
    if (!id || id.trim() == '') {
        return res.statusCode(401).json({ msg: 'no se pudo', isValid: false })
    }

    const obtenerValores = await Mejora.findByPk(id);

    obtenerValores.estatus = 4
    obtenerValores.motivo = motivo
    // let resultados = await Mejora.update(campos, {where: {id: id}})
    await obtenerValores.save();

    // await emailMejoraRespuesta({ generador_idea: obtenerValores.generador_idea, nombre_mejora: obtenerValores.nombre_mejora, email: obtenerValores.email, resultado: 'Rechazada' });
    await emailMejoraRespuesta(obtenerValores);

    res.send({ ok: true, msg: 'mejora rechazada.' })
}

controller.ActualizarMejoras = async (req, res) => {
    let misDatos = req.body;
    delete misDatos._csrf;
    if (!misDatos.fecha_respuesta_comite) {
        misDatos.fecha_respuesta_comite =
            format({
                date : new Date(),
                format: "YYYY-MM-DD",
                tz: "America/Mexico_City",
            })
    }
    let datos = {}
    for (let clave in misDatos) {
        datos[clave] = misDatos[clave]
    }

    

    const obtenerValores = await Mejora.findByPk(misDatos.id);
    obtenerValores.fecha_respuesta_comite = misDatos.fecha_respuesta_comite
    obtenerValores.motivo = misDatos.motivo
    obtenerValores.estatus = misDatos.estatus

    // switch (misDatos.estatus) {
        // case 2:
            // await emailMejoraRespuesta({ generador_idea: obtenerValores.generador_idea, nombre_mejora: obtenerValores.nombre_mejora, email: obtenerValores.email, resultado: 'En espera de modificacion', fecha_respuesta_comite: datos.fecha_respuesta_comite });
            await emailMejoraRespuesta(obtenerValores);
            // break;
        // case 3:
            // await emailMejoraRespuesta({ generador_idea: obtenerValores.generador_idea, nombre_mejora: obtenerValores.nombre_mejora, email: obtenerValores.email, resultado: 'Aceptada', fecha_respuesta_comite: datos.fecha_respuesta_comite });
            // await emailMejoraRespuesta(obtenerValores);
            // break;
    //     default:
    //         break;
    // }
    let id = datos.id
    delete datos.id;
    if (!misDatos) return res.statusCode(401).json({ ok: false, msg: 'no se encontraron los parametros' })
    try {
        // await Mejora.update(datos, { where: { id } })
        obtenerValores.save();
        return res.json({ ok: true, msg: 'Mejora Actualizada Exitosamente' })
    }
    catch (ex) {

        return res.json({ ok: false, msg: "no se pudo realizar la solicitud" })
    }
}
//controlador de actividades
controller.bitacoraActividades = async (req, res)=>{



    let token = req.csrfToken()
    let clase = new sequelizeClase({modelo: modeloDirectorioCalidad});

    
    let criterio = {id: {[Op.gt]: 0}}
    try{
        let resultados = await bitacoraActividades.findAll({
            where: {
                estatus: {
                [Op.ne]:'COMPLETADA'
                },
                
            }
    })

    
        // let empleados = await tablaEmpleados.findAll({
        //     where: {
        //         descripcion: {
        //             [Op.like]: "%calidad%"
        //         }
        //     }
        // });

        let empleados = await clase.obtenerDatosPorCriterio({criterio:criterio})

        
        res.render('admin/calidad/bitacoraActividades', {resultados, empleados,token})
    }catch(ex){
        console.log(ex);
        
    }
    
}

controller.agregarActividad = async (req, res)=>{
        try{
        let {nombreActividad, responsable, area, prioridad, estatus, avance, fechaCompromiso, evaluacion, numeroEmpleado} = req.body
            bitacoraActividades.create({
                nombreActividad: nombreActividad,
                responsable: responsable,
                area:area,
                prioridad:prioridad,
                estatus:estatus,
                avance:avance,
                fechaCompromiso:fechaCompromiso,
                evaluacion:evaluacion,
                numeroEmpleado:numeroEmpleado
            })

            
        res.send({ok: true, msg: 'Actividad registrada con exito.'})
        }catch(ex){
            res.send({ok: false, msg: `hubo un error ${ex.toString()}`})
        }
    }
controller.actividades = async (req, res)=>{
        let {tipo} = req.body
        let datos, id 
        if (!tipo) return res.json({ok:false, msg:"se requiere el tipo de procedimiento"})
            let clase = new claseSeq({modelo: bitacoraActividades})
        switch (tipo){
        case 'insert':
            datos = req.body.datos
            if(!datos) return  res.json({ok:false, msg:"no vienen los datos"})  
            return res.json({ok : await clase.insertar({datosInsertar: datos})})
        case 'delete':
            id = req.body.id
            if(!id) return res.json({ok:false, msg:'no se encontro el id para poder realizar el procedmiento delete'})
            return res.json({ok: await clase.eliminar({id: id})})
        case 'update':
            id = req.body.id
            datos = req.body.datos 
            if (!id) if(!id) return res.json({ok:false, msg:'no se encontro el id para poder realizar el procedmiento update'})
                return res.json({ok: clase.actualizarDatos({id:id, datos:datos})
            })
        }
    }

controller.misActividades = async (req, res)=>{
    let token = req.csrfToken()
    let clase = new claseSeq({ modelo: modeloDirectorioCalidad })
    let criterios = {
        numeroEmpleado: req.usuario.codigoempleado
    }
    let usuario = await clase.obtenerDatosPorCriterio({criterio: criterios})
    usuario = usuario[0]
    if (!usuario) return new Error('no se encontro el usuario')
    
     clase = new claseSeq({ modelo: bitacoraActividades })
     delete criterios.numeroEmpleado;
     criterios =
    {
        estatus: {  
            [Op.ne]: 'Completada'
        },
        numeroEmpleado: {
            [Op.eq]: usuario.id
        }

    }
    
    let actividades = await clase.obtenerDatosPorCriterio({ criterio: criterios })
    
    res.render("admin/calidad/mis_actividades", { actividades: actividades, token: token })
}
controller.asignarAvance = async (req, res)=>{
    const archivos = req.files;
    if (!archivos) return res.json({ok: false, msg:'no se recibieron los archivos multimedia'})
    const nombresArchivos = archivos.map(file => file.filename);
    let {id, avance, comentarios, estatus} = req.body
    if (!id) return res.json({msg: 'no se encontro el che id', ok: false})
        try{
            let clase = new sequelizeClase({modelo: bitacoraActividades});            
            let actualizacion = await clase.actualizarDatos({
                id: id, datos: {evidencia: nombresArchivos, avance: avance, comentariosUsuario: comentarios, estatus: estatus}
            })
            return res.json({
                ok: actualizacion,
                msg: actualizacion ? 'registro de avance exitoso': 'no se pudo registrar la actualizacion'
            })  
        }catch(ex){
            return res.json({
                ok: false,
                msg: 'no se pudo registrar la actualizacion'
            })  
        }
    
}
    
    //ruta de refresco de csurf
controller.refreshToken = (req, res)=>{
    let archivos = req.files
    res.json({_csrf: req.csrfToken()})
}

controller.recordatorio = async (req,res)=>{
    fun()
    res.send("todo bien");
}

//rutas de directorio
controller.directorioPersonal = async(req, res)=>{
    let tok = req.csrfToken()
    let clase =new claseSeq({modelo: modeloDirectorioCalidad})
    let criterios = {id:{[Op.gt]:0}}
    let resultados = await clase.obtenerDatosPorCriterio({criterio: criterios})
    res.render("admin/calidad/directorio.ejs", {contactos: resultados, tok: tok})
}
controller.CrudDirectorio = async (req, res)=>{
    let {tipo, id} = req.body;
    let campos = req.body
    if (!tipo ) throw new Error('se requiere el tipo de proceso para poder procesar la solicitud y el identificador')
        delete campos.id;
        delete campos._csrf;
        delete campos.tipo;
        let clase = new claseSeq({modelo: modeloDirectorioCalidad})    
        let resultado
        switch(tipo){
        case 'insert':
            campos
            resultado = await clase.insertar({datosInsertar: campos})
            if (!resultado) return res.json({msg:'no se pudo ingresar la informacion', ok:false})
                return res.json({msg:`${campos.nombreCompleto} fue registrad(@) exitosamente`, ok:true})
        case 'update':
                resultado = await clase.actualizarDatos({id: id, datos:campos})
                if (!resultado) return res.json({msg:'no se pudo realizar la actualizacion de la informacion', ok:false})
                    return res.json({msg:'informacion actualizada exitosamente', ok:true})
        case 'delete':
            resultado = await clase.eliminar({id:id})
            if (!resultado) return res.json({msg:'no se pudo realizar la actualizacion de la informacion', ok:false})
                    return res.json({msg:'proceso realizado exitosamente', ok:true})
    }        
    
    
}


controller.api = (req, res) => {
    const { documento } = req.params
    res.render('admin/calidad/calidadD', { documento })
}

//rutas de 5´s
controller.verificacion5s = async(req, res)=>{
    try{
        const tok = req.csrfToken()
        const nomina = req.usuario.codigoempleado
        console.log(nomina)
        let clase = new sequelizeClase({modelo: barrilcalidad.modeloDirectorioCalidad})
        let usuario = await clase.obtener1Registro({criterio:{numeroEmpleado: nomina}})
        res.render('admin/calidad/formato_verificacion_5s.ejs',{nombre: usuario.nombreCompleto, tok: tok})
    }catch(ex){
        res.send(`algo salio muy mal y no se pudo cargar la informacion el error fue: ${ex}`)
    }
    
}
controller.ingresarRegistro5s = async(req, res) => {
    try{
        let archivos = req.files;
        if(!archivos) return res.send('no hay archivos procesados')
        let campos = req.body
        delete campos.department
        delete campos._csrf
        campos.secciones = JSON.parse(campos.secciones)
        campos.images = archivos.map((file) => {return file.filename}).join(', ')
        let clase = new sequelizeClase({modelo: barrilcalidad.modeloFormato5s})
        return res.json({msg:'ingreso exitoso', ok: await clase.insertar({datosInsertar: campos})})
        
    }catch(ex){
        return res.send(`algo salio muy mal, error: ${ex}`)
    }
    
}
//controladores de inicio
controller.inicio= (req, res)=>{
    res.render('admin/calidad/inicioCalidad.ejs')
}

//controladores de auditorias
controller.agregarAuditoria = (req, res) => {
 return res.render('admin/calidad/agregarAuditoria.ejs')   
}
controller


export default controller;

