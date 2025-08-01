import express from "express";
import db from "../config/db.js";
import {
    Checklistcc1,
    Empleados,
    informaciongch,
    Usuario,
    CotizacionesCC1,
    Controlpiezas,
    // PersonalCC1
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

controller.personaloperativo = (req, res) => {

    let rCotizacionesCC1 = CotizacionesCC1.findAll();

    rCotizacionesCC1 = [{
        id: 1,
        numeroCotizacion: '123456789'
    },
    {
        id: 2,
        numeroCotizacion: '987654321'
    },
    {
        id: 3,
        numeroCotizacion: '111111111'
    },
    {
        id: 4,
        numeroCotizacion: '222222222'
    },
    {
        id: 5,
        numeroCotizacion: '333333333'
    }]

    res.render('admin/sorteo/cc1/personaloperativo',{
        rCotizacionesCC1
    });
}

controller.personaloperativo2 = (req, res) => {

    const {
        nombreInspector,
        ilu,
        planta,
        cotizacion
    } = req.body

    PersonalCC1.create({
        nombreInspector,
        ilu,
        planta,
        cotizacion
    })
}

controller.cotizaciones = (req, res) => {
    res.render('admin/sorteo/cc1/cotizaciones');
}

controller.cotizaciones2 = (req, res) => {
    res.render('admin/sorteo/cc1/cotizaciones');
}

controller.controldepiezas2 = (req, res) => {
    res.render('admin/sorteo/cc1/controldepiezas');
}


export default controller;