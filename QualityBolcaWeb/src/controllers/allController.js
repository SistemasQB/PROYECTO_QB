import express from "express";

import Curso from "../models/cursos.js"


const app = express();

const controller = {};

controller.subirCurso = async (req, res) => {
    res.render('todos/cursos',{
        mensaje: false,
        csrfToken: req.csrfToken()
    })
}

controller.subirCurso2 = async(req, res) => {
    const { nombreCurso, descripcion, capacitador, disponible, fechaInicio, fechaFinal, horarioInicio, horarioFinal, ubicacion } = req.body
    
    const cursoDatos = await Curso.create({
        nombreCurso,
        descripcion,
        capacitador,
        disponible,
        fechaInicio,
        fechaFinal,
        horarioInicio,
        horarioFinal,
        ubicacion
    });
    
    

    res.render('todos/cursos',{
        mensaje: true,
        csrfToken: req.csrfToken()
    })
}

export default controller;