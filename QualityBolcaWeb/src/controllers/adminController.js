import express from "express";
// import Listas from "../models/listas.js"
// import Requisicion from "../models/requisicion.js"
// import Curso from "../models/cursos.js"
// import PedirCurso from "../models/pedirCurso.js"
// import RegistroMa from "../models/registroma.js";
// import RegistroCursos from "../models/registroCursos.js"
// import Comunicacion from "../models/comunicacion.js"
// import { informaciongch , informacionpuesto} from "../models/index.js"

import {
    Asistencia,
    Cps,
    ControlDispositivos,
    DocumentosControlados,
    EncuestaS,
    juegos,
    Mejora,
    pedirCurso,
    precios,
    puestos,
    registroCurso,
    registroma,
    requisicion,
    verificacion5s,
    CheckListVehiculos,
    Listas,
    Requisicion,
    Curso,
    RegistroCursos,
    Comunicacion,
    Usuario,
    Gch_Alta,
    informaciongch,
    informacionpuesto,
    Glosario
} from "../models/index.js";
// import InformacionpuestoM from "../models/informacionpuesto.js"

// import Gch_alta from "../models/gch_alta.js"
import Sequelize from 'sequelize'
import on from 'sequelize'
import { Op } from 'sequelize'
import { emailRequisicion, registroCursos } from "../helpers/emails.js";
import { pipeline } from '@xenova/transformers';
import wavefile from 'wavefile';
import fs from 'fs';

// Comunicacion.belongsTo(Gch_alta, { foreignKey: 'id', targetKey: 'curp'  });
// Gch_alta.hasOne(Comunicacion, { foreignKey: 'curp', targetKey: 'id'  })




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

controller.directorio = async (req, res) => {
    let vCrup;

    const bGch_alta = await informaciongch.findAll({
        attributes: ['idpuesto', 'nombre', 'apellidopaterno', 'apellidomaterno', 'fechanacimiento', 'fechaalta', 'sexo', 'numerosegurosocial', 'fotografia'],
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


        include: [{
            model: informacionpuesto,
            attributes: ['descripcion'],
            on: {
                idpuesto: Sequelize.where(Sequelize.col('nom10001.idpuesto'), '=', Sequelize.col('nom10006.idpuesto'))
            }
        }],
        order: [[Sequelize.literal('nombre'), 'ASC']],
    }
    )
        .then(resultado => {
            vCrup = resultado
        });


    res.render('admin/directorio', {
        vCrup
    })
}

controller.requisicion = async (req, res) => {
    const planta = await Listas.findAll();
    const resultadoPlanta = JSON.parse(JSON.stringify(planta, null, 2));
    res.render('admin/requisicion3', {
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

controller.requisicion3 = async (req, res) => {

    console.log('subiendo imagen...');

}

controller.requisicionA = async (req, res) => {
    const requi = await Requisicion.findAll();
    res.render('admin/requisicionA', {
        requi
    })
}

controller.requisicionA2 = (req, res) => {
    res.render('admin/requisicionA')
}

controller.cursos = async (req, res) => {
    const vCursos = await Curso.findAll();

    res.render('admin/cursos', {
        vCursos,
        csrfToken: req.csrfToken()
    })
}

controller.cursos2 = async (req, res) => {
    const vCursos = await Curso.findAll();
    const { nombreCurso, asistenciaNombres, correo, fecha, horario, ubicacion, correoContacto, nombreContacto } = req.body

    const regCursos = await RegistroCursos.create(
        { nombreCurso, asistenciaNombres, correo, fecha, horario, ubicacion }
    )


    registroCursos({
        nombreCurso: regCursos.nombreCurso,
        asistenciaNombres: regCursos.asistenciaNombres,
        correo: regCursos.correo,
        fecha: regCursos.fecha,
        horario: regCursos.horario,
        ubicacion: regCursos.ubicacion,
        correoDestino: correoContacto,
        nombreContacto: nombreContacto
    })


}

controller.subirCurso = (req, res) => {
    res.render('admin/registrarCursos', {
        mensaje: false,
        csrfToken: req.csrfToken()
    })
}

controller.subirCurso2 = async (req, res) => {
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



    res.render('admin/registrarCursos', {
        mensaje: true,
        csrfToken: req.csrfToken()
    })
}

controller.solicitudServicio = (req, res) => {
    res.render('admin/solicitudServicio', {
        mensaje: false,
        csrfToken: req.csrfToken()
    })
}

controller.solicitudServicio2 = async (req, res) => {
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



    res.render('admin/solicitudServicio', {
        mensaje: true,
        csrfToken: req.csrfToken()
    })
}

controller.pedirCurso = async(req, res) => {
    let vCrup;

    const bGch_alta = await informaciongch.findAll({
        attributes: ['nombrelargo'],
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
        }
    })
        .then(resultado => {
            vCrup = resultado
        });
    res.render('admin/pedirCurso', {
        csrfToken: req.csrfToken(),
        vCrup
    })
}

controller.pedirCurso2 = async (req, res) => {
    const { nombre, curso, region } = req.body

    const pedirC = await pedirCurso.create({
        nombre,
        region,
        curso
    });
}

controller.solicitudesCursos = async(req, res) => {
    const vPedirCurso = await pedirCurso.findAll();
    res.render('admin/solicitudesCursos', {
        csrfToken: req.csrfToken(),
        vPedirCurso
    })
}

controller.solicitudesCursos2 = async (req, res) => {
    const { nombre, curso, region } = req.body

    const pedirC = await pedirCurso.create({
        nombre,
        region,
        curso
    });
}

controller.registroma = async (req, res) => {
    const vRegistro = await RegistroMa.findAll();
    res.render('admin/registroma', {
        vRegistro,
        csrfToken: req.csrfToken()
    })
}

controller.registroma2 = async (req, res) => {
    const { nombre, email } = req.usuario
    const { region, tipo, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12 } = req.body
    const registroDatos = await RegistroMa.create({
        nombre,
        region,
        tipo,
        email,
        c1,
        c2,
        c3,
        c4,
        c5,
        c6,
        c7,
        c8,
        c9,
        c10,
        c11,
        c12
    });

    res.status(200).send({ ok: true });
    return
    // res.render('admin/registroma',{
    //     mensaje: true,
    //     csrfToken: req.csrfToken()
    // })
}

controller.vacaciones = (req, res) => {
    res.render('admin/vacaciones')
}

controller.vacaciones2 = (req, res) => {
    res.render('admin/vacaciones')
}

controller.voz = (req, res) => {
    res.render('admin/texto_voz')
}

controller.mapa = (req, res) => {
    res.render('admin/mapas')
}

controller.valeSalida = (req, res) => {
    res.render('admin/vale')
}

controller.mejoracontinua = (req, res) => {
    res.render('admin/mejoracontinua')
}

controller.mejoracontinua2 = (req, res) => {
    res.render('admin/mejoracontinua')
}


controller.reuniones = (req, res) => {
    res.render('admin/reuniones')
}

controller.reuniones2 = (req, res) => {
    res.render('admin/reuniones')
}

controller.glosario = async (req, res) => {
    const glosario = await Glosario.findAll();
    res.render('admin/glosario', {
        glosario
    })
}

controller.api = async (req, res) => {
    const glosario = await Glosario.findAll();
    res.json(JSON.stringify(glosario, null, 2));
    // res.j
}

controller.organigrama = (req, res) => {
    res.render('admin/organigrama')
}

controller.valeresguardo = (req, res) => {
    res.render('admin/valeresguardo')
}

controller.valeresguardo2 = (req, res) => {
    res.render('admin/valeresguardo')
}

controller.generarfirma = (req, res) => {
    res.render('admin/generarfirma')
}


export default controller;