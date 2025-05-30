import express from "express";
import db from "../config/db.js";
import {
    registroma,
    informaciongch,
    informacionpuesto,
    Inventario,
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
         left JOIN nom10001 n1 ON n1.codigoempleado = v.numeroEmpleado
         left JOIN nom10006 n6 ON n1.idpuesto = n6.idpuesto
         where tipo = 'Laptop' or tipo = 'Ensamblado'
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

    res.render('admin/sistemas/programamantenimiento');
}

controller.listadopersonal = async (req, res) => {

    const personal = await db.query(
        `
            SELECT i.idInventario, i.tipo, i.folio ,i.marca, i.historial, v.firma, n1.nombrelargo, n6.descripcion
            FROM inventario i
            INNER JOIN vales v ON i.folio = v.idfolio
            INNER JOIN nom10001 n1 ON n1.codigoempleado = v.numeroEmpleado
            INNER JOIN nom10006 n6 ON n1.idpuesto = n6.idpuesto
         `,
        {
            type: QueryTypes.SELECT // Tipo de consulta: SELECT
        }
    )


    res.render('admin/sistemas/listadopersonal',{
        csrfToken: req.csrfToken(),
        personal
    });
}

export default controller;