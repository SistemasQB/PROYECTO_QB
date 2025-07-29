import express from "express";
import Verificacion5s from "../models/verificacion5s.js"
import Sequelize, { where } from 'sequelize'
import fs from 'fs';

import {emailMejoraRespuesta} from "../helpers/emails.js";

import {
    Mejora
} from "../models/index.js";


const app = express();

const controller = {};

controller.subirsemanal = (req, res) => {
    res.render('admin/nominas/subirsemanal',{
        csrfToken: req.csrfToken()
    });
}

controller.subirsemanal2 = (req, res) => {
    console.log('controlador');
    
    console.log(req.body);
    
}


export default controller;