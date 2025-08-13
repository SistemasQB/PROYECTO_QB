import express from "express";
import db from "../config/db.js";
import {
    Checklistcc1,
    Empleados,
    informaciongch,
    Usuario,
    CotizacionesCC1,
    Controlpiezas,
    PersonalCC1,
    LoteCC1
} from "../models/index.js";
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

export default controller;