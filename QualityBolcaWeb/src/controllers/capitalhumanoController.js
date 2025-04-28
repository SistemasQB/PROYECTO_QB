import express from "express";


import {
    informaciongch,
    informacionpuesto,
    BuzonQuejas
} from "../models/index.js";
import Sequelize, { where } from 'sequelize'
import { Op } from 'sequelize'





const app = express();

const controller = {};

controller.directorioGCH = async (req, res) => {
    let vCrup;

    const bGch_alta = await informaciongch.findAll({
        attributes: ['idempleado', 'idpuesto', 'nombre', 'codigoempleado', 'apellidopaterno', 'apellidomaterno', 'fechanacimiento', 'fechaalta', 'sexo', 'numerosegurosocial'],
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
                    },
                    {
                        fotografia: { [Op.eq]: '' },
                    }
                ]
        },
        //     include: [{
        //         model: informacionpuesto,
        //         attributes: ['descripcion'],
        //         on: {
        //             idpuesto: {
        //     [Sequelize.Op.eq]: Sequelize.col('nom10006'+'.idpuesto')
        //   }
        //         }
        //     }]

        include: [{
            model: informacionpuesto,
            attributes: ['descripcion'],
            on: {
                idpuesto: Sequelize.where(Sequelize.col('nom10001.idpuesto'), '=', Sequelize.col('nom10006.idpuesto'))
            }
        }]
    }
    )
        .then(resultado => {
            // console.log(resultado[0]);

            vCrup = resultado
        });

    // console.log(vCrup[0].comunicacion.telefono);
    //  console.log(vCrup[61]);

    res.render('admin/capitalhumano/directorio', {
        vCrup
    })
}

controller.subirfoto = async (req, res) => {
    const { idempleado } = req.params

    const fotoempleado = await informaciongch.findByPk(idempleado)

    if (!fotoempleado) {
        return res.redirect('/capitalhumano/directorio');
    }

    if (fotoempleado.foto != null) {
        return res.redirect('/capitalhumano/directorio');
    }

    console.log(fotoempleado.idempleado);

    res.render('admin/capitalhumano/subirfoto', {
        csrfToken: req.csrfToken(),
        fotoempleado
    })
}
controller.subirfoto2 = async (req, res, next) => {
    const { idempleado } = req.params
    const informacionR = await informaciongch.findByPk(idempleado)

    console.log(informacionR);

    try {
        // console.log('nombre de la imagen', req.file.filename);

        //almacenar el pdf
        informacionR.fotografia = req.file.filename
        await informacionR.save();
        next()

    } catch (error) {
        console.log(error);

    }

    // res.render('admin/capitalhumano/subirfoto',{
    //     csrfToken: req.csrfToken()
    // })
}

controller.buzonquejas = async (req, res) => {
    const resultadoQuejas = await BuzonQuejas.findAll();
    const resultadoQuejas2 = JSON.stringify(resultadoQuejas, null, 2);

    res.render('admin/capitalhumano/buzonQuejas', {
        csrfToken: req.csrfToken(),
        resultadoQuejas,
        resultadoQuejas2
    })
}

controller.buzonquejas2 = async (req, res, next) => {
    const { acciones, idQR } = req.body
    const informacionR = await BuzonQuejas.findOne( { where: { id: idQR } })

    // console.log(informacionR);

    try {
        // console.log('nombre de la imagen', req.file.filename);

        //almacenar el pdf
        informacionR.estado = 'Resuelta'
        informacionR.acciones = acciones
        await informacionR.save();
        // next()
        res.status(200).send({ msg: 'Acciones enviadas', ok: true });
        return
    } catch (error) {
        res.status(400).send({ msg: 'Acciones no enviadas', ok: false });
        return
    }

    // res.render('admin/capitalhumano/subirfoto',{
    //     csrfToken: req.csrfToken()
    // })
}

controller.vacaciones = async (req, res) => {
    res.render('admin/capitalhumano/vacaciones')
}

controller.altagch = async (req, res) => {

    


    res.render('admin/capitalhumano/altagch',{
        csrfToken: req.csrfToken()
    })
}

export default controller;