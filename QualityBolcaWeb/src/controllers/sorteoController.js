import express from "express";
import db from "../config/db.js";
import sequelizeClase from "../public/clases/sequelize_clase.js";
// import modelosSorteo from "../models/sorteo/barrilModelosSorteo.js";



import {
    Checklistcc1,
    Empleados,
    informaciongch,
    Usuario,
    CotizacionesCC1,
    Controlpiezas,
    PersonalCC1,
    LoteCC1,
    modelosSorteo
} from "../models/index.js";
const { modeloEntregaMaterial,
    modeloNuevoMaterial,
    modeloEdgewell } = modelosSorteo
import Sequelize from 'sequelize'
import { Op, QueryTypes } from 'sequelize'


const app = express();

const controller = {};

controller.kiosk = async (req, res) => {
    let vCrup;

    const bGch_alta = await informaciongch.findAll({
        attributes: ['nombre', 'nombrelargo', 'codigoempleado'],
        where: {
            [Op.or]:
                [
                    {
                        fechaalta: { [Op.gt]: Sequelize.col('fechabaja') }
                    },
                    {
                        fechareingreso: { [Op.gt]: Sequelize.col('fechabaja') }
                    },
                ],
            [Op.and]:
                [
                    {
                        idpuesto: { [Op.ne]: 45 },
                    }
                ]
        },
        order: [[Sequelize.literal('nombre'), 'ASC']],
    }
    )
        .then(resultado => {
            vCrup = resultado
        });
    res.render('admin/sorteo/kiosk', {
        vCrup
    });
}
controller.kiosk2 = (req, res) => {
    res.render('admin/sorteo/kiosk');
}

controller.etiquetado = (req, res) => {
    res.render('admin/sorteo/honda/etiquetado');
}

controller.etiquetado2 = (req, res) => {
    res.render('admin/sorteo/honda/etiquetado');
}

controller.vistatotal = (req, res) => {
    res.render('admin/sorteo/cc1/vistatotal');
}

controller.checklist = (req, res) => {


    res.render('admin/sorteo/cc1/checklist',{
        csrfToken: req.csrfToken(),
    });
}

controller.checklist2 = async (req, res) => {
    const {
        codigoEmpleado,
        pswEmpleado,
        Area,
        Equipo,
        fecha,
        turno,
        reviso,
        elaboro,
        aprobo,
        listado,
        anomalias,
        observaciones,
    } = req.body

    //Validar usuario existente

    // const usuario = await Usuario.findOne({ where: { codigoEmpleado } })
    // if (!usuario) {
    //     res.status(400).send({ msg: 'El usuario no existe', ok: false });
    //     return
    // }

    // Revisar la contrseña

    // if (!usuario.verificarPasssword(pswEmpleado)) {
    //     res.status(400).send({ msg: 'La contrseña no es correcta', ok: false });
    //     return
    // }

    // const nomUsuario = await Empleados.findOne({ where: { codigoEmpleado } })
    // const reviso = nomUsuario.nombre + ' ' + nomUsuario.apellidopaterno + ' ' + nomUsuario.apellidomaterno

    // console.log(req.body);

    const rchecklist = await Checklistcc1.create({
        Area,
        Equipo,
        fecha,
        turno,
        elaboro,
        reviso,
        aprobo,
        listado,
        anomalias,
        observaciones,
    })

    res.status(200).send({ msg: 'Checklist enviado con exito', ok: true });
    return


}

controller.vistachecklist = async (req, res) => {

    let rChecks
    const rconsulta = await Checklistcc1.findAll()
    .then((result) => {
        rChecks = result
    });

    

    res.render('admin/sorteo/cc1/vistachecklist',{
        rChecks
    });
}

controller.registromaterial = (req, res) => {
    res.render('admin/sorteo/cc1/registromaterial');
}

controller.personaloperativo = async(req, res) => {

    const rCotizacionesCC1 = await CotizacionesCC1.findAll({attributes: ['numeroCotizacion']});
    // console.log(rCotizacionesCC1);
    

    res.render('admin/sorteo/cc1/personaloperativo',{
        rCotizacionesCC1,
        csrfToken: req.csrfToken()
    });
}

controller.personaloperativo2 = async(req, res) => {

    try {
        
        // const obtenernombre = JSON.parse(req.body.personas)
        
        // console.log(obtenernombre);
        
        const json = JSON.parse(req.body.personas);
        // json.nombreInspector = JSON.stringify(obtenernombre.nombreInspector).toUpperCase();
        // console.log(json);
        
        await PersonalCC1.bulkCreate(json);
        res.status(200).send({ msg: 'Datos enviados con exito', ok: true });
    } catch (error) {
        res.status(400).send({ msg: 'Error al enviar la informacion: ' + error, ok: false });
    }
}

controller.cotizaciones = (req, res) => {
    res.render('admin/sorteo/cc1/cotizaciones',{
        csrfToken: req.csrfToken()
    });
}

controller.cotizaciones2 = async (req, res) => {

    const { numeroCotizacion, numeroParte, nombreParte,rateCotizado  } = req.body

        try {
        await CotizacionesCC1.create({ numeroCotizacion, numeroParte, nombreParte,rateCotizado });
        res.status(200).send({ msg: 'Datos enviados con exito', ok: true });
    } catch (error) {
        res.status(400).send({ msg: 'Error al enviar la informacion: ' + error, ok: false });
    }
}

controller.lote = (req, res) => {
    res.render('admin/sorteo/cc1/lote',{
        csrfToken: req.csrfToken()
    });
}

controller.lote2 = async (req, res) => {
        const { lote, cotizacion, cantidadPiezas,numeroCajas  } = req.body

        try {
        await LoteCC1.create({ lote, cotizacion, cantidadPiezas,numeroCajas  });
        res.status(200).send({ msg: 'Datos enviados con exito', ok: true });
    } catch (error) {
        res.status(400).send({ msg: 'Error al enviar la informacion: ' + error, ok: false });
    }
}

controller.controldepiezas = async (req, res) => {


    const rCotizacionesCC1 = await CotizacionesCC1.findAll({attributes: ['id','numeroCotizacion','numeroParte']});
    const rPersonalCC1 = await PersonalCC1.findAll({attributes: ['id','nombreInspector']});

    res.render('admin/sorteo/cc1/controlpiezas',{
        rCotizacionesCC1,
        rPersonalCC1,
        csrfToken: req.csrfToken()
    });
}

controller.controldepiezas2 = async (req, res) => {
            try {
        const json = JSON.parse(req.body.cotizaciones);
        await Controlpiezas.bulkCreate(json);
        res.status(200).send({ msg: 'Datos enviados con exito', ok: true });
    } catch (error) {
        res.status(400).send({ msg: 'Error al enviar la informacion: ' + error, ok: false });
    }
    
}

controller.secciones = (req, res) => {
    res.render('admin/sorteo/cc1/secciones');
}

controller.secciones2 = (req, res) => {
    res.render('admin/sorteo/cc1/secciones');
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
    let dia, mesi, ano 
    dia = fecha.getDay()
    mesi = fecha.getMonth()
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
    console.log(datos)
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
    // datos.partidas.cantidadPiezas = parseFloat(datos.cantidad);
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
        console.log(fecha)
        let clase = new sequelizeClase({modelo: modeloEdgewell});
        let criterios = {[Op.and]:[
            {fecha:{[Op.between]: [fi, fecha]}},
            {estatus:'ENVIADO'}
        ]}
        let embarques = await clase.obtenerDatosPorCriterio({criterio: criterios})
        res.render('admin/sorteo/inicio_almacen.ejs', {embarques: embarques, tok: tok})
    }
    catch (ex ){
        console.log(ex);
    }
}

controller.puntoEntrada = async (req, res)=>{
    let tok = req.csrfToken()
    let id = req.params.id;
    console.log(`el id de consulta es ${id}`)
    let clase = new sequelizeClase({modelo: modelosSorteo.modeloEdgewell})
    let criterios = {id:id}
    let embarquito = await clase.obtener1Registro({criterio :criterios})
    return res.render('admin/sorteo/formulario_ingreso_almacen.ejs', {embarque: embarquito, tok:tok})
}
controller.vistaCliente = (req, res)=>{
    
}

controller.prueba = (req, res)=>{
    let tok = req.csrfToken()
    res.render('admin/sorteo/formulario-entrega-material.ejs', {tok:tok})
}


export default controller;