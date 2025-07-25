import express from "express";
import db from "../config/db.js";
import {
    registroma,
    informaciongch,
    informacionpuesto,
    Inventario,
    Solicitudservicio,
    Vales
} from "../models/index.js";

import { Op, QueryTypes } from 'sequelize'


const app = express();

const controller = {};

controller.registroMA = async (req, res) => {
    const registro = await registroma.findAll();
    const resultador = JSON.stringify(registro, null, 2)
    res.render('admin/sistemas/registromati', {
        resultador
    });
}
controller.addinventario = async (req, res) => {

    res.render('admin/sistemas/addinventario', {
        csrfToken: req.csrfToken()
    });
}

controller.addinventario2 = async (req, res) => {

    const {
        idInventario,
        tipo,
        marca,
        serie,
        folio,
        estado,
        precio,
        fechaCompra,
        fechaEntrega,
        usoExclusivo,
        accesorios,
        comentarios,
        codigoResguardo,
        ultimoMantenimiento
    } = req.body

    const InventarioR = await Inventario.create({
        idInventario,
        tipo,
        marca,
        serie,
        folio,
        estado,
        precio,
        fechaCompra,
        fechaEntrega,
        usoExclusivo,
        accesorios,
        comentarios,
        codigoResguardo,
        ultimoMantenimiento
    })

    res.status(200).send({ ok: true });
    return
}


controller.tablainventario = async (req, res) => {

    res.render('admin/sistemas/tablainventario');
}

controller.api = async (req, res) => {
    const { query2 } = req.params
    let valeasignacion
    // const resultado = await db.query(
    //     `SELECT i.*, v.*, n1.nombrelargo, n6.descripcion
    //      FROM inventario i
    //      INNER JOIN vales v ON i.folio = v.idfolio
    //      INNER JOIN nom10001 n1 ON n1.codigoempleado = v.numeroEmpleado
    //      INNER JOIN nom10006 n6 ON n1.idpuesto = n6.idpuesto
    //      WHERE i.folio = :nfolio;`,
    //     {
    //       replacements: { nfolio: '40' }, // Sustituir parámetros
    //       type: QueryTypes.SELECT // Tipo de consulta: SELECT
    //     }
    //   )
    const resultado = await db.query(
        query2,
        {
            //   replacements: { nfolio: '40' }, // Sustituir parámetros
            type: QueryTypes.SELECT // Tipo de consulta: SELECT
        }
    )
        .then((resultados) => {
            valeasignacion = resultados;
        });



    // res.render('admin/valeresguardo',{
    //     csrfToken: req.csrfToken(),
    //     valeasignacion
    // })
    res.send(valeasignacion)
}

controller.addvales = async (req, res) => {

    res.render('admin/sistemas/addvales', {
        csrfToken: req.csrfToken()
    });
}


controller.addvales2 = async (req, res) => {

    const {
        idFolio,
        numeroEmpleado,
        fechaFolio
    } = req.body

    const valesR = await Vales.create({
        idFolio,
        numeroEmpleado,
        fechaFolio
    })

    res.status(200).send({ ok: true });
    return
}
controller.registromantenimiento = async (req, res) => {
    let valeasignacion;

    const resultado = await db.query(
        `SELECT i.*, v.*, n1.nombrelargo, n6.descripcion
         FROM inventario i
         
         left JOIN vales v ON i.folio = v.idfolio
         right JOIN nom10001 n1 ON n1.codigoempleado = v.numeroEmpleado
         left JOIN nom10006 n6 ON n1.idpuesto = n6.idpuesto
         where tipo = 'Laptop' or tipo = 'Ensamblado' or tipo = 'Allinone'
         order by idInventario asc;`,
        {
            type: QueryTypes.SELECT // Tipo de consulta: SELECT
        }
    ).then((resultados) => {
        valeasignacion = resultados;
    });

    // res.send({valeasignacion});

    res.render('admin/sistemas/registromantenimiento', {
        csrfToken: req.csrfToken(),
        valeasignacion,
        resultado
    })
}

controller.programamantenimiento = async (req, res) => {

    let programaResultados

    const resultados = await db.query(
        `
        SELECT i.idInventario, i.marca, i.tipo, i.usoExclusivo, i.ultimoMantenimiento, i.fechaCompra,
        n1.nombrelargo, n3.descripcion region FROM qualitybolca.inventario i
        left join vales v on i.folio = v.idFolio
        inner join nom10001 n1 on v.numeroEmpleado = n1.codigoempleado
        right join nom10003 n3 on n1.iddepartamento = n3.iddepartamento
        where tipo IN ('Allinone','Laptop','Ensamblado')
        order by idInventario;
        `,
        {
            type: QueryTypes.SELECT // Tipo de consulta: SELECT
        }
    ).then((resultados) => {
        programaResultados = resultados;
    });

    res.render('admin/sistemas/programamantenimiento',{
        csrfToken: req.csrfToken(),
        programaResultados
    });
}

controller.listadopersonal = async (req, res) => {
    let personal2
    let cuentaDatos

    const personal = await db.query(
        `
            SELECT 
            GROUP_CONCAT(i.idInventario) AS idInventario_concat, 
            GROUP_CONCAT(i.tipo) AS tipo_concat, 
            GROUP_CONCAT(i.marca) AS marca_concat, 
            GROUP_CONCAT(i.serie) AS serie,
            GROUP_CONCAT(i.estado) AS estado,
            GROUP_CONCAT(i.accesorios) AS accesorios,
            GROUP_CONCAT(i.detalles) AS detalles,
            MAX(i.historial) AS historial, 
            MAX(v.firma) AS firma, 
            n1.nombrelargo, 
            i.usoExclusivo,
            i.folio,
            i.fechaEntrega,
            v.numeroEmpleado,
            v.fechaFolio,
            MAX(n6.descripcion) AS descripcion
            FROM inventario i
            LEFT JOIN vales v ON i.folio = v.idfolio
            INNER JOIN nom10001 n1 ON n1.codigoempleado = v.numeroEmpleado
            INNER JOIN nom10006 n6 ON n1.idpuesto = n6.idpuesto
            GROUP BY n1.nombrelargo;
         `,
        {
            type: QueryTypes.SELECT // Tipo de consulta: SELECT
        }
    ).then((resultados) => {
        personal2 = resultados;
    });

    res.render('admin/sistemas/listadopersonal', {
        csrfToken: req.csrfToken(),
        personal2
    });
}
controller.listadosolicitudes = async (req, res) => {
    let listadoSolicitudes
    let cuentaDatos

    const personal = await Solicitudservicio.findAll(
    ).then((resultados) => {
        listadoSolicitudes = resultados;
    });

    res.render('admin/sistemas/solicitudes', {
        csrfToken: req.csrfToken(),
        listadoSolicitudes
    });
}

controller.mantenimientoautonomo = async (req, res) => {
    let matenimientos
    let cuentaDatos

    const personal = await registroma.findAll()
        .then((resultados) => {
            matenimientos = resultados;
        });

    res.render('admin/sistemas/mantenimientoautonomo', {
        csrfToken: req.csrfToken(),
        matenimientos
    });
}



export default controller;