import express from "express";
import Listas from "../models/listas.js"
import Requisicion from "../models/requisicion.js"
import Curso from "../models/cursos.js"
import RegistroCursos from "../models/registroCursos.js"
import sequelize from 'sequelize'
import { emailRequisicion, registroCursos } from "../helpers/emails.js";
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
    res.render('admin/requisicion', {
        resultadoPlanta,
        csrfToken: req.csrfToken(),
        mensaje: false
    })
}

controller.requisicion2 = async (req, res) => {

    const planta2 = await Listas.findAll();
    const resultadoPlanta = JSON.parse(JSON.stringify(planta2, null, 2));
    const { id, rentabilidad, autoriza, departamento, orden, descripcion, fechaEntrega, total, situacionActual, detallesEspectativa, comentariosAdicionales, noCuenta, horaRegistro, estatus, solicitante, puesto, region, planta, jerarquiaSolicitante, asunto, proceso, contacto, foto } = req.body

    const reqDatos = await Requisicion.create({
        id,
        rentabilidad,
        autoriza,
        departamento,
        orden,
        descripcion,
        fechaEntrega,
        total,
        situacionActual,
        detallesEspectativa,
        comentariosAdicionales,
        noCuenta,
        horaRegistro,
        estatus,
        solicitante,
        puesto,
        region,
        planta,
        jerarquiaSolicitante,
        asunto,
        proceso,
        contacto,
        foto,
    });
    
    emailRequisicion({
        id: reqDatos.id,
        solicitante: reqDatos.solicitante,
        asunto: reqDatos.asunto,
        autoriza: reqDatos.autoriza
    })

    res.render('admin/requisicion', {
        resultadoPlanta,
        csrfToken: req.csrfToken(),
        mensaje: true
    })
}

controller.requisicionA = async (req, res) => {
    const requi = await Requisicion.findAll();
    res.render('admin/requisicionA',{
        requi
    })
}

controller.requisicionA2 = (req, res) => {
    res.render('admin/requisicionA')
}

controller.cursos = async (req, res) => {
    const vCursos = await Curso.findAll();
    
    res.render('admin/cursos',{
        vCursos,
        csrfToken: req.csrfToken()
    })
}

controller.cursos2 = async (req, res) => {
    const vCursos = await Curso.findAll();
    const {nombreCurso, asistenciaNombres, correo, fecha, horario, ubicacion, correoContacto, nombreContacto} = req.body

    const regCursos = await RegistroCursos.create(
        {nombreCurso, asistenciaNombres, correo, fecha, horario, ubicacion}
    )


    // registroCursos({
    //     nombreCurso: regCursos.nombreCurso,
    //     asistenciaNombres: regCursos.asistenciaNombres,
    //     correo: regCursos.correo,
    //     fecha: regCursos.fecha,
    //     horario: regCursos.horario,
    //     ubicacion: regCursos.ubicacion,
    //     correoDestino: correoContacto,
    //     nombreContacto: nombreContacto
    // })

    // res.render('admin/cursos',{
    //     vCursos,
    //     csrfToken: req.csrfToken()
    // })
    // res.send('Hola mundo')

    
}

controller.subirCurso = async (req, res) => {
    res.render('admin/registrarCursos',{
        mensaje: false,
        csrfToken: req.csrfToken()
    })
}

controller.subirCurso2 = async(req, res) => {
    const { nombreCurso, descripcion, capacitador, duracion, correoContacto, disponible, fechaInicio, fechaFinal, horarioInicio, horarioFinal, ubicacion } = req.body
    
    const cursoDatos = await Curso.create({
        nombreCurso,
        descripcion,
        capacitador,
        duracion,
        correoContacto,
        disponible,
        fechaInicio,
        fechaFinal,
        horarioInicio,
        horarioFinal,
        ubicacion
    });
    
    

    res.render('admin/registrarCursos',{
        mensaje: true,
        csrfToken: req.csrfToken()
    })
}

controller.voz = (req, res) => {
    res.render('admin/texto_voz')
}

controller.valeSalida = (req, res) => {
    res.render('admin/vale')
}

export default controller;