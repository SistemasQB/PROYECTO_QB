import express from "express";
import Verificacion5s from "../models/verificacion5s.js"
import Sequelize, { where } from 'sequelize'
import fs from 'fs';
import claseSeq from "../public/clases/sequelize_clase.js";
import { emailMejoraRespuesta } from "../helpers/emails.js";
import { Op, QueryTypes } from 'sequelize'

import {
    Mejora,
    bitacoraActividades,
    Empleados
} from "../models/index.js";


const app = express();

const controller = {};

controller.verificacion5s = (req, res) => {
    res.render('admin/calidad/verificacion5s');
}

controller.verificacion5s2 = (req, res) => {

}

controller.evidencias = async (req, res) => {



    const obtenerValores = await Mejora.findAll({ where: { estatus: 3 }, order: [[Sequelize.literal('fecha'), 'DESC']], });

    res.render('admin/calidad/evidencias', {
        csrfToken: req.csrfToken(),
        obtenerValores
    });
}

controller.mejoracontinua = async (req, res) => {
    try {
        let resultados = await Mejora.findAll({
            where: { estatus: 1 }
        })
        //TODO: posible condicionante de 0 rows
        let token = req.csrfToken()
        res.render('admin/calidad/comitemejoracontinua',
            {
                resultados,
                csrfToken: token
            }
        )
    } catch (ex) {

    };
}
controller.rechazarMejora = async (req, res) => {
    console.log('entro al rechazo')
    let { id, motivo } = req.body;
    if (!id || id.trim() == '') {
        return res.statusCode(401).json({ msg: 'no se pudo', isValid: false })
    }

    const obtenerValores = await Mejora.findByPk(id);
    console.log(obtenerValores);

    obtenerValores.estatus = 4
    obtenerValores.motivo = motivo
    // let resultados = await Mejora.update(campos, {where: {id: id}})
    await obtenerValores.save();

    await emailMejoraRespuesta({ generador_idea: obtenerValores.generador_idea, nombre_mejora: obtenerValores.nombre_mejora, email: obtenerValores.email, resultado: 'Rechazada' });

    res.send({ ok: true, msg: 'mejora rechazada.' })
}

controller.ActualizarMejoras = async (req, res) => {
    let misDatos = req.body;
    delete misDatos._csrf;
    misDatos.fecha_respuesta_comite = new Date.now().toLocaleDateString('es-ES')
    let datos = {}
    for (let clave in misDatos) {
        datos[clave] = misDatos[clave]
    }

    const obtenerValores = await Mejora.findByPk(misDatos.id);
    switch (misDatos.estatus) {
        case 2:
            await emailMejoraRespuesta({ generador_idea: obtenerValores.generador_idea, nombre_mejora: obtenerValores.nombre_mejora, email: obtenerValores.email, resultado: 'En espera de modificacion', fecha_respuesta_comite: datos.fecha_respuesta_comite });
            break;
        case 3:
            await emailMejoraRespuesta({ generador_idea: obtenerValores.generador_idea, nombre_mejora: obtenerValores.nombre_mejora, email: obtenerValores.email, resultado: 'Aceptada', fecha_respuesta_comite: datos.fecha_respuesta_comite });
            break;
        default:
            break;
    }
    let id = datos.id
    delete datos.id;
    if (!misDatos) return res.statusCode(401).json({ ok: false, msg: 'no se encontraron los parametros' })
    try {
        await Mejora.update(datos, { where: { id } })
        return res.json({ ok: true, msg: 'Mejora Actualizada Exitosamente' })
    }
    catch (ex) {

        return res.json({ ok: false, msg: "no se pudo realizar la solicitud" })
    }
}


//rutas de actividades

controller.bitacoraActividades = async (req, res) => {
    let token = req.csrfToken()
    try {
        let resultados = await bitacoraActividades.findAll({
            where: {
                estatus: {
                    [Op.ne]: 'COMPLETADA'
                },

            }
        })
        let empleados = await Empleados.findAll({
            where: {
                descripcion: {
                    [Op.like]: "%calidad%"
                }
            }
        });
        res.render('admin/calidad/bitacoraActividades', { resultados, empleados, token })
    } catch (ex) {

    }

}

controller.agregarActividad = async (req, res) => {

    console.log(req.usuario);
    
    try {
        let { nombreActividad, responsable, area, prioridad, estatus, avance, fechaCompromiso, evaluacion } = req.body
        bitacoraActividades.create({
            nombreActividad: nombreActividad,
            responsable: responsable,
            area: area,
            prioridad: prioridad,
            estatus: estatus,
            avance: avance,
            fechaCompromiso: fechaCompromiso,
            evaluacion: evaluacion
        })
        res.send({ ok: true, msg: 'Actividad registrada con exito.' })
    } catch (ex) {
        res.send({ ok: false, msg: `hubo un error ${ex.toString()}` })
    }
}
controller.actividades = async (req, res) => {
    let { tipo } = req.body
    let datos, id
    if (!tipo) return res.json({ ok: false, msg: "se requiere el tipo de procedimiento" })
    let clase = new claseSeq({ modelo: bitacoraActividades })
    switch (tipo) {
        case 'insert':
            datos = req.body.datos
            if (!datos) return res.json({ ok: false, msg: "no vienen los datos" })
            return res.json({ ok: await clase.insertar({ datosInsertar: datos }) })

        case 'delete':
            console.log("entro al delete")
            id = req.body.id
            if (!id) return res.json({ ok: false, msg: 'no se encontro el id para poder realizar el procedmiento delete' })
            return res.json({ ok: await clase.eliminar({ id: id }) })

        case 'update':
            id = req.body.id
            datos = req.body.datos
            if (!id) if (!id) return res.json({ ok: false, msg: 'no se encontro el id para poder realizar el procedmiento update' })
            return res.json({ ok: clase.actualizarDatos({ id: id, datos: datos }) })

    }

}

controller.misActividades = async (req, res) => {
    let token = req.csrfToken()
    let clase = new claseSeq({ modelo: bitacoraActividades })
    let criterios =
    {
        estatus: {
            [Op.ne]: 'Completada'
        },
        numeroEmpleado: {
            [Op.eq]: req.usuario.codigoempleado
        }

    }
        let actividades = await clase.obtenerDatosPorCriterio({ criterio: criterios })
        res.render("admin/calidad/mis_actividades", { actividades: actividades, token: token })

}
    controller.asignarAvance = async (req, res) => {
        let archivos = req.files
        if (!archivos) return res.json({ ok: false, msg: 'no se recibieron los archivos multimedia' })
        const nombresArchivos = archivos.map(file => file.filename);
        let { id, avance, comentarios, estatus } = req.body
        if (!id) return res.json({ msg: 'no se encontro el che id', ok: false })
        try {
            let clase = new claseSeq({ modelo: bitacoraActividades });
            let actualizacion = await clase.actualizarDatos({
                id: id, datos: { evidencia: nombresArchivos, avance: avance, comentariosUsuario: comentarios, estatus: estatus }
            })
            return res.json({
                ok: actualizacion,
                msg:'registro de avance exitoso'
            })
        } catch (ex) {
            return res.json({
                ok: false,
                msg: 'no se pudo registrar la actualizacion' + ex
            })
        }


        return res.json({ ok: true, msg: 'finalizo el procedimiento sin hacer nada' })

    }




    export default controller;