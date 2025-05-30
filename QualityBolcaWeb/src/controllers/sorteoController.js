import express from "express";
import db from "../config/db.js";
import {
    informaciongch
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
    res.render('admin/sorteo/kiosk',{
        vCrup
    });
}
controller.kiosk2 =  (req, res) => {
    res.render('admin/sorteo/kiosk');
}

controller.etiquetado =  (req, res) => {
    res.render('admin/sorteo/etiquetado');
}

controller.etiquetado2 =  (req, res) => {
    res.render('admin/sorteo/etiquetado');
}

export default controller;