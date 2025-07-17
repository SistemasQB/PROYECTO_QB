import express from "express";
import Verificacion5s from "../models/verificacion5s.js"
import Sequelize, { where } from 'sequelize'
import fs from 'fs';

import {
    Mejora
} from "../models/index.js";


const app = express();

const controller = {};

controller.verificacion5s = (req, res) => {
    res.render('admin/calidad/verificacion5s');
}

controller.verificacion5s2 = (req, res) => {
    
}

controller.evidencias = async (req, res) => {
    res.render('admin/calidad/evidencias');
}

controller.evidencias = async (req, res) => {

    

    const obtenerValores = await Mejora.findAll({ where: { estatus: 3 }, order: [[Sequelize.literal('fecha'), 'DESC']], });

    res.render('admin/calidad/evidencias',{
        csrfToken: req.csrfToken(),
        obtenerValores
    });
}

export default controller;