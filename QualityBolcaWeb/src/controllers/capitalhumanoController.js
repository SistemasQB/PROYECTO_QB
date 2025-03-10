import express from "express";


import {
    informaciongch,
    informacionpuesto,
} from "../models/index.js";
import Sequelize from 'sequelize'
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

export default controller;