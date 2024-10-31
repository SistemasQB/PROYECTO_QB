import express from "express";
import Listas from "../models/listas.js"
import Requisicion from "../models/requisicion.js"

import { pipeline } from '@xenova/transformers';
import wavefile from 'wavefile';
import fs from 'fs';


const app = express();

const controller = {};

controller.inicio = (req, res) => {
    res.render('admin/inicio')
}

controller.enviar = (req, res) => {
    res.render('todos/requisicion')
}

controller.crear = (req, res) => {
    res.render('admin/crear')
}

controller.requisicion = async (req, res) => {
    const planta = await Listas.findAll();
    const resultadoPlanta = JSON.parse(JSON.stringify(planta, null, 2));
    res.render('admin/requisicion2', {
        resultadoPlanta,
        csrfToken: req.csrfToken(),
        mensaje: false
    })
}

controller.requisicion2 = async (req, res) => {
    const planta2 = await Listas.findAll();
    const resultadoPlanta = JSON.parse(JSON.stringify(planta2, null, 2));
    const { rentabilidad, responsable, proceso, departamento, asunto, orden_servicio, planta, region, descripcion, fecha_requerida, total, situacion_actual, espectativa, comentarios, tarjeta, imagen, estatus, solicitante, puesto, jerarquia_Solicitante, contacto } = req.body

    const reqDatos = await Requisicion.create({
        rentabilidad,
        responsable,
        proceso,
        departamento,
        asunto,
        orden_servicio,
        planta,
        region,
        descripcion,
        fecha_requerida,
        total,
        situacion_actual,
        espectativa,
        comentarios,
        tarjeta,
        imagen,
        estatus,
        solicitante,
        puesto,
        jerarquia_Solicitante,
        contacto
    });
    
    res.render('admin/requisicion2', {
        resultadoPlanta,
        csrfToken: req.csrfToken(),
        mensaje: true
    })
}

controller.voz = (req, res) =>{
    res.render('admin/texto_voz')
}

controller.valeSalida = (req, res) => {
    res.render('admin/vale')
}

export default controller;