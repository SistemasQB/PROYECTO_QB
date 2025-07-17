import express from "express";
import cron from "node-cron";
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
    // Gch_Alta,
    informaciongch,
    informacionpuesto,
    Glosario,
    Vales,
    Inventario,
    BuzonQuejas,
    Vacaciones,
    Solicitudservicio,
    Empleados
} from "../models/index.js";
// import InformacionpuestoM from "../models/informacionpuesto.js"

// import Gch_alta from "../models/gch_alta.js"
import Sequelize, { DATE, where } from 'sequelize'
import db from "../config/db.js";

import on from 'sequelize'
import { Op, QueryTypes } from 'sequelize'
import { emailRequisicion, registroCursos, emailMantenimientoA, emailSolicitud } from "../helpers/emails.js";
import { pipeline } from '@xenova/transformers';
import wavefile from 'wavefile';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // obtener la ruta resuelta al archivo 
const __dirname = path.dirname(__filename); // obtener el nombre del directorio
// const dataPath = path.join(__dirname, 'data.json');
import RegistroMa from "../models/registroma.js";

// Comunicacion.belongsTo(Gch_alta, { foreignKey: 'id', targetKey: 'curp'  });
// Gch_alta.hasOne(Comunicacion, { foreignKey: 'curp', targetKey: 'id'  })




const app = express();

const controller = {};

controller.inicio = (req, res) => {
    if (req.originalUrl) {
        res.redirect(req.originalUrl);
    } else {
        res.render('admin/inicio')
    }
}

controller.permisosusuarios = (req, res) => {
    res.render('admin/permisosusuarios')
}

controller.permisosusuarios2 = (req, res) => {
    res.render('admin/permisosusuarios')
}

controller.enviar = (req, res) => {
    res.render('todos/requisicion')
}

controller.crear = (req, res) => {
    res.render('admin/crear')
}

controller.directorio = async (req, res) => {
    let Rcomunicacion2;


    const Rcomunicacion = await db.query(
        `SELECT c.correo, c.telefono, e.*, u.fotografia
         FROM comunicacions c
         right JOIN empleados e ON c.id = e.codigoempleado
         left JOIN usuarios u on c.id = u.codigoempleado
         order by apellidopaterno asc;
         `,
        {
            type: QueryTypes.SELECT // Tipo de consulta: SELECT
        }
    ).then((resultados) => {
        Rcomunicacion2 = resultados;
    });

    res.render('admin/directorio', {
        Rcomunicacion2
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

controller.solicitudServicio = async (req, res) => {

    const { codigoempleado } = req.usuario

    const obtenerNombre = await informaciongch.findOne({ where: { codigoempleado: codigoempleado }, attributes: ['nombrelargo'] });
    const obtenerValores = await Solicitudservicio.findAll({ where: { solcitante: obtenerNombre.nombrelargo }, order: [[Sequelize.literal('fecha'), 'DESC']], });
    const obtenerFolio = await Solicitudservicio.count() + 1;



    res.render('admin/solicitudServicio', {
        obtenerFolio,
        obtenerNombre,
        obtenerValores,
        csrfToken: req.csrfToken()
    })
}

controller.solicitudServicio2 = async (req, res) => {
    const { idFolio, solcitante, fecha, region, email, tipo, descripcion, solucion, fechaSolucion } = req.body

    try {
        const cursoDatos = await Solicitudservicio.create({
            idFolio,
            solcitante,
            fecha,
            region,
            email,
            tipo,
            descripcion,
            solucion,
            fechaSolucion
        });



        await emailSolicitud({ idFolio: cursoDatos.idFolio, solcitante: cursoDatos.solcitante })
        res.status(200).send({ msg: 'Solicitud enviada', ok: true, folio: cursoDatos.idFolio });
        return
    } catch (error) {
        // res.status(400).send({ msg: 'Error al enviar la solicitud', ok: false });
        res.status(400).send({ msg: error, ok: false });
        return
    }

}

controller.pedirCurso = async (req, res) => {
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

controller.solicitudesCursos = async (req, res) => {
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
    res.render('admin/registroMA', {
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
    res.render('admin/vacaciones', {
        csrfToken: req.csrfToken()
    })
}

controller.vacaciones2 = async (req, res) => {

    const { codigoempleado } = req.usuario

    const { dias } = req.body

    try {
        // BuzonQuejas.comentarios = comentarios
        await Vacaciones.create({ dias: dias, numeroEmpleado: codigoempleado })
        // next()
        res.status(200).send({ msg: 'Enviado', ok: true });
        return
    } catch (error) {
        res.status(400).send({ msg: error, ok: false });

        return
    }

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

/*
    0 -- ingresada sin análisis
1 -- ingresada con análisis
2 -- modificar
3 -- Aceptada
4 -- Rechazada
5 -- Declinada por falta de seguimiento
6 -- Implementada
    */

controller.mejoracontinua = async (req, res) => {

    const { codigoempleado } = req.usuario

    const obtenerDatos = await Empleados.findOne({ where: { codigoempleado: codigoempleado } });
    const obtenerValores = await Mejora.findAll({ where: { numero_empleado_registra: codigoempleado }, order: [[Sequelize.literal('fecha'), 'DESC']], });

    res.render('admin/mejoracontinua', {
        csrfToken: req.csrfToken(),
        obtenerDatos,
        obtenerValores
    })
}

controller.mejoracontinua2 = async (req, res) => {

    const { codigoempleado } = req.usuario

    const {
        id,
        fecha,
        nombre_mejora,
        generador_idea,
        nombre_equipo,
        numero_participantes,
        nombre_participantes,
        proceso_aplica_mejora,
        region_aplica_mejora,
        rubro,
        beneficios,
        inversion,
        monto,
        recuperacion,
        situacion_actual,
        situacion_mejora,
        mejora_grupal,
        estatus,
        fecha_respuesta_comite,
        email,
        motivo,
        titulo_analisis
    } = req.body


    try {
        const Rmejora = await Mejora.create(
            {
                id,
                fecha,
                nombre_mejora,
                generador_idea,
                nombre_equipo,
                numero_participantes,
                nombre_participantes,
                numero_empleado_registra: codigoempleado,
                proceso_aplica_mejora,
                region_aplica_mejora,
                rubro,
                beneficios,
                inversion,
                monto,
                recuperacion,
                situacion_actual,
                situacion_mejora,
                mejora_grupal,
                estatus,
                fecha_respuesta_comite,
                email,
                motivo,
                titulo_analisis
            }
        )

        res.status(200).send({ msg: 'Mejora Enviada', ok: true, id: Rmejora.id });
        return
    } catch (error) {
        // const errorLog = `${new Date().toISOString()} - Error: ${errorMessage}\n`;



        console.error("Error al enviar tu mejora", error);
        res.status(400).send({ msg: "Error al enviar tu mejora", ok: false });
        return
    }

}

controller.mejoracontinua3 = async (req, res) => {

    const { codigoempleado } = req.usuario

    const {
        id,
        fecha,
        nombre_mejora,
        generador_idea,
        nombre_equipo,
        numero_participantes,
        nombre_participantes,
        proceso_aplica_mejora,
        region_aplica_mejora,
        rubro,
        beneficios,
        inversion,
        monto,
        recuperacion,
        situacion_actual,
        situacion_mejora,
        mejora_grupal,
        estatus,
        fecha_respuesta_comite,
        email,
        motivo,
        titulo_analisis
    } = req.body


    try {

        await Mejora.update(
            {
                fecha,
                nombre_mejora,
                generador_idea,
                nombre_equipo,
                numero_participantes,
                nombre_participantes,
                numero_empleado_registra: codigoempleado,
                proceso_aplica_mejora,
                region_aplica_mejora,
                rubro,
                beneficios,
                inversion,
                monto,
                recuperacion,
                situacion_actual,
                situacion_mejora,
                mejora_grupal,
                estatus: 0,
                fecha_respuesta_comite,
                email,
                motivo,
                titulo_analisis: ''
            },
            { where: { id } }
        )

        res.status(200).send({ msg: 'Mejora Enviada', ok: true, id: id });
        return
    } catch (error) {
        // const errorLog = `${new Date().toISOString()} - Error: ${errorMessage}\n`;



        console.error("Error al enviar tu mejora", error);
        res.status(400).send({ msg: "Error al enviar tu mejora", ok: false });
        return
    }

}

controller.mejoracontinua4 = async (req, res) => {

    // const { codigoempleado } = req.usuario

    // const obtenerDatos = await Empleados.findOne({ where: { codigoempleado: codigoempleado } });
    const obtenerValores = await Mejora.findAll({ where: { estatus: { [Op.ne]: 0 } }, order: [[Sequelize.literal('fecha'), 'DESC']] });


    res.render('admin/mejoracontinuaall', {
        csrfToken: req.csrfToken(),
        // obtenerDatos,
        obtenerValores
    })
}

controller.subiranalisis = async (req, res) => {

    const { mejoraid } = req.params
    const obtenerAnalisis = await Mejora.findByPk(mejoraid);

    if (obtenerAnalisis.estatus != 0 || !obtenerAnalisis) {
        res.redirect('../../admin/mejoracontinua')
    } else {
        res.render('admin/subiranalisis', {
            csrfToken: req.csrfToken(),
            mejoraid
        })
    }


}

controller.subiranalisis2 = async (req, res) => {


    const { mejoraid } = req.params
    const obtenerAnalisis = await Mejora.findByPk(mejoraid);

    try {
        obtenerAnalisis.titulo_analisis = req.file.filename
        obtenerAnalisis.estatus = 1

        await obtenerAnalisis.save();
        // next()
        res.status(200).send({ msg: 'Analisis enviado con exito', ok: true });
        return
    } catch (error) {
        res.status(400).send({ msg: 'Error al enviar el analisis' + error, ok: false });
        return
    }
}

controller.subirevidencia = async (req, res) => {

    const { mejoraid } = req.params
    const obtenerAnalisis = await Mejora.findByPk(mejoraid);


    if (obtenerAnalisis.evidencia1 === '' && obtenerAnalisis.evidencia2 === '' && obtenerAnalisis.evidencia3 === '' || obtenerAnalisis || obtenerAnalisis.estatus !== 5) {
        res.render('admin/subirevidencia', {
            csrfToken: req.csrfToken(),
            mejoraid
        })
    } else {
        res.redirect('../../admin/mejoracontinua')
    }

}

controller.subirevidencia2 = async (req, res) => {


    const { mejoraid } = req.params
    const obtenerAnalisis = await Mejora.findByPk(mejoraid);

    try {
        if (!obtenerAnalisis.evidencia1) {
            obtenerAnalisis.evidencia1 = req.file.filename
            obtenerAnalisis.fechaevidencia1 = new Date().toLocaleDateString('es-ES')
        } else if (!obtenerAnalisis.evidencia2) {
            obtenerAnalisis.evidencia2 = req.file.filename
            obtenerAnalisis.fechaevidencia2 = new Date().toLocaleDateString('es-ES')
        } else if (!obtenerAnalisis.evidencia3) {
            obtenerAnalisis.evidencia3 = req.file.filename
            obtenerAnalisis.fechaevidencia3 = new Date().toLocaleDateString('es-ES')
        } else {
            obtenerAnalisis.evidencia4 = req.file.filename
            obtenerAnalisis.fechaevidencia4 = new Date().toLocaleDateString('es-ES')
        }

        await obtenerAnalisis.save();
        // next()
        res.status(200).send({ msg: 'Analisis enviado con exito', ok: true });
        return
    } catch (error) {
        res.status(400).send({ msg: 'Error al enviar el analisis' + error, ok: false });
        return
    }
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

controller.api2 = async (req, res) => {
    const glosario = await Glosario.findAll();
    res.json(JSON.stringify(glosario, null, 2));
    // res.j
}

controller.api = async (req, res) => {
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

    res.json(JSON.stringify(vCrup, null, 2));
    // res.j
}

controller.organigrama = (req, res) => {
    res.render('admin/organigrama')
}

controller.valeresguardo = async (req, res) => {
    let valeasignacion

    const { codigoempleado } = req.usuario

    const obtenerFolio = await Vales.findOne({ where: { numeroEmpleado: codigoempleado } });

    const resultado = await db.query(
        `SELECT i.*, v.*, n1.nombrelargo, n6.descripcion
         FROM inventario i
         left JOIN vales v ON i.folio = v.idfolio
         left JOIN nom10001 n1 ON n1.codigoempleado = v.numeroEmpleado
         left JOIN nom10006 n6 ON n1.idpuesto = n6.idpuesto
         WHERE i.folio = :nfolio;`,
        {
            replacements: { nfolio: obtenerFolio.idFolio }, // Sustituir parámetros
            type: QueryTypes.SELECT // Tipo de consulta: SELECT
        }
    ).then((resultados) => {
        valeasignacion = resultados;
    });



    res.render('admin/valeresguardo', {
        csrfToken: req.csrfToken(),
        valeasignacion
    })
}

controller.valeresguardo2 = async (req, res, next) => {

    const { codigoempleado } = req.usuario

    const obtenerFolio = await Vales.findOne({ where: { numeroEmpleado: codigoempleado } });

    try {
        obtenerFolio.Firma = req.file.filename
        await obtenerFolio.save()
        next()
        res.status(200).send({ msg: 'Firma enviada con exito', ok: true });
        return
    } catch (error) {
        res.status(400).send({ msg: 'Error al firmar el vale', ok: false });
        return
    }
}

controller.valeresguardo3 = async (req, res) => {

    const { codigoempleado } = req.usuario

    const { comentarios } = req.body

    const obtenerFolio = await Vales.findOne({ where: { numeroEmpleado: codigoempleado } });


    try {
        obtenerFolio.comentarios = comentarios
        await obtenerFolio.save()
        // next()
        res.status(200).send({ msg: 'Comentarios enviados', ok: true });
        return
    } catch (error) {
        res.status(400).send({ msg: 'Error al enviar los comentarios', ok: false });
        return
    }
}

controller.generarfirma = (req, res) => {
    const { codigo } = req.params
    res.render('admin/generarfirma', {
        csrfToken: req.csrfToken(),
        codigo
    })
}

controller.mantenimientoautonomo = async (req, res) => {

    const { codigoempleado } = req.usuario

    const obtenerNombre = await informaciongch.findOne({ attributes: ['nombrelargo'], where: { codigoempleado: codigoempleado } });

    res.render('admin/mantenimientoautonomo', {
        csrfToken: req.csrfToken(),
        obtenerNombre
    })
}

controller.mantenimientoautonomo2 = async (req, res) => {

    const { nombre, tipo, region, respuestas } = req.body

    // const registromantenimiento = await registroma.findOne({ where: { nombre: nombre } });


    try {

        await registroma.update(
            { tipo, region, respuestas },
            { where: { nombre } }
        )
        // Enviar email de confirmacion
        await emailMantenimientoA({ region, respuestas, tipo, nombre })

        res.status(200).send({ msg: 'Mantenimiento enviada', ok: true });
        return
    } catch (error) {
        console.error("Error al enviar correo o guardar datos:", error);
        res.status(400).send({ msg: error, ok: false });
        return
    }
}

controller.buzonquejas = (req, res) => {
    res.render('admin/buzonQuejas', {
        csrfToken: req.csrfToken()
    })
}

controller.buzonquejas2 = async (req, res) => {

    const { codigoempleado } = req.usuario

    const { fechaIncidente, descripcion, region } = req.body



    const obtenerNombre = await informaciongch.findOne({ where: { codigoempleado: codigoempleado } });


    try {
        // BuzonQuejas.comentarios = comentarios
        await BuzonQuejas.create({ nombreEmpleado: obtenerNombre.nombrelargo, fechaIncidente, descripcion, region })
        // next()
        res.status(200).send({ msg: 'Queja enviada', ok: true });
        return
    } catch (error) {
        res.status(400).send({ msg: error, ok: false });

        return
    }


}

controller.publicarEvento = (req, res) => {
    res.render('admin/publicarevento')
}

controller.publicarEvento2 = (req, res) => {
    res.render('admin/publicarevento')
}

controller.validarusuario = async (req, res) => {

    const { codigoEmpleado, pswEmpleado } = req.body



}

controller.blogayuda = (req, res) => {

    function cargarJSONLocal() {
        const ruta = path.join(__dirname, 'blogayuda.json');
        try {
            const contenido = fs.readFileSync(ruta, 'utf-8');
            posts = JSON.parse(contenido);
            // Aquí puedes usar `posts` como quieras
        } catch (error) {
            console.error("Error al leer el archivo JSON:", error);
        }
    }

    cargarJSONLocal();

    res.render('admin/blogdeayuda', {
        csrfToken: req.csrfToken(),
        posts
    })
}
controller.blogayuda2 = (req, res) => {

    const nuevoPost = req.body;

    const ruta = path.join(__dirname, 'blogayuda.json');

    try {
        // Leer el archivo actual
        const contenido = fs.readFileSync(ruta, 'utf-8');
        const posts = JSON.parse(contenido);

        delete nuevoPost._csrf

        nuevoPost.replies = []

        // Agregar el nuevo post
        posts.push(nuevoPost);

        // Guardar el archivo actualizado
        fs.writeFileSync(ruta, JSON.stringify(posts, null, 2), 'utf-8');

        res.send({ ok: true, msg: 'Post guardado correctamente' });
    } catch (error) {
        console.error('Error al guardar el post:', error);
        res.status(500).send({ ok: false, msg: 'Error al guardar el post' });
    }
}


controller.blogayuda3 = (req, res) => {
    const nuevoPost = { ...req.body };
    const { postId, replyPath } = req.body;


    const ruta = path.join(__dirname, 'blogayuda.json');

    try {
        const contenido = fs.readFileSync(ruta, 'utf-8');
        const posts = JSON.parse(contenido);

        const post = posts.find((p) => p.id == postId);

        // const record = mejoras.find(item => item.id === mejoraId);

        // Limpieza de campos innecesarios
        delete nuevoPost._csrf;
        delete nuevoPost.currentReplyTarget;



        nuevoPost.replies = [];

        if (post) {
            let targetReplies = post.replies;

            // Navegar hasta el nivel correcto de respuestas anidadas
            for (let i = 0; i < replyPath.length - 1; i++) {
                targetReplies = targetReplies[replyPath[i]].replies;
            }

            if (replyPath.length === 0) {
                post.replies.push(nuevoPost);
            } else {
                targetReplies[replyPath[replyPath.length - 1]].replies.push(nuevoPost);
            }

            // ✅ Guardar el objeto completo actualizado
            fs.writeFileSync(ruta, JSON.stringify(posts, null, 2), 'utf-8');

            res.send({ ok: true, msg: 'Post guardado correctamente' });
        } else {
            res.status(404).send({ ok: false, msg: 'Post no encontrado' });
        }
    } catch (error) {
        console.error('Error al guardar el post:', error);
        res.status(500).send({ ok: false, msg: 'Error al guardar el post' });
    }
};

let posts;





// Guardar datos
// function guardarDatos(data) {
//   fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
// }


// 🕒 Ejecuta la verificación todos los días a las 9:00 AM
// cron.schedule('0 9 * * *', async () => {
cron.schedule('* * * * *', () => {
    console.log('Verificando...', DATE.now());
    verificarMejora();
});

async function  verificarMejora() {
    let obtenerValores 

    obtenerValores = await Mejora.findAll({ where:{  [Op.and] : [{ estatus: 3 }, { evidencia1: null }] }});
    // console.log(obtenerValores[0].nombre_mejora);
    console.log('15 dias', obtenerValores.length);
    
    for (let c = 0; c < obtenerValores.length; c++) {

        const fecha15dias = new Date(obtenerValores[c].fecha_respuesta_comite);

        const fecha10dias = new Date(obtenerValores[c].fecha_respuesta_comite);
  
        fecha15dias.setDate(fecha15dias.getDate() + 15);
        fecha10dias.setDate(fecha10dias.getDate() + 10);
        console.log(obtenerValores[c].fecha_respuesta_comite);
        

        console.log(fecha15dias);
        console.log(fecha10dias);

        console.log(estaEnRango(fecha10dias, fecha15dias));

        if (estaEnRango(fecha10dias, fecha15dias)) {
            console.log(obtenerValores[c].nombre_mejora, '15 dias');
        }
    }

    obtenerValores = await Mejora.findAll({ where:{  [Op.and] : [{  evidencia1: {[Op.ne]: null} }, { evidencia2: null }] }});
    console.log('1 mes', obtenerValores.length);

    for (let c = 0; c < obtenerValores.length; c++) {
        let resultado = obtenerRangoSemanaAntesDelMes(new Date(obtenerValores[c].fecha_respuesta_comite), 1);
        
        // console.log(estaEnRango(resultado.desde, resultado.hasta));
        if (estaEnRango(resultado.desde, resultado.hasta)) {
            console.log(obtenerValores[c].nombre_mejora, '1 mes');
        }
    }

    obtenerValores = await Mejora.findAll({ where:{  [Op.and] : [{  evidencia2: {[Op.ne]: null} }, { evidencia3: null }] }});
    console.log('2 mes', obtenerValores.length);
    for (let c = 0; c < obtenerValores.length; c++) {
        let resultado = obtenerRangoSemanaAntesDelMes(new Date(obtenerValores[c].fecha_respuesta_comite), 2);
        
        // console.log(estaEnRango(resultado.desde, resultado.hasta));
        if (estaEnRango(resultado.desde, resultado.hasta)) {
            console.log(obtenerValores[c].nombre_mejora, '2 mes');
        }
    }

    obtenerValores = await Mejora.findAll({ where:{  [Op.and] : [{  evidencia3: {[Op.ne]: null} }, { evidencia4: null }] }});
    console.log('3 mes', obtenerValores.length);
    for (let c = 0; c < obtenerValores.length; c++) {
        let resultado = obtenerRangoSemanaAntesDelMes(new Date(obtenerValores[c].fecha_respuesta_comite), 3);
        
        // console.log(estaEnRango(resultado.desde, resultado.hasta));
        if (estaEnRango(resultado.desde, resultado.hasta)) {
            console.log(obtenerValores[c].nombre_mejora, '3 mes');
        }
    }
}

function estaEnRango(fechaInicio, fechaFin) {
  const hoy = new Date();
  return hoy >= fechaInicio && hoy < fechaFin;
}

function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}/${month}/${day}`;
}

function validarFechas(fechaBaseStr) {
    const fechaBase = new Date(fechaBaseStr);
    const hoy = new Date();

    // Normalizamos horas para comparar solo fechas
    fechaBase.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    const msPorDia = 1000 * 60 * 60 * 24;
    const diasTranscurridos = Math.floor((hoy - fechaBase) / msPorDia);

    // Condición 1: más de 15 y menos de 20 días
    const dentroDe8a15 = diasTranscurridos > 8 && diasTranscurridos < 15;

    const dentroDe23a30 = diasTranscurridos > 23 && diasTranscurridos < 30;

    const dentroDe53a60 = diasTranscurridos > 53 && diasTranscurridos < 60;

    const dentroDe83a90 = diasTranscurridos > 83 && diasTranscurridos < 90;

    // Condición 2: meses completos

    const dentroDe15a20 = diasTranscurridos > 15 && diasTranscurridos < 20;

    const dentroDe30a35 = diasTranscurridos > 30 && diasTranscurridos < 35;

    const dentroDe60a65 = diasTranscurridos > 60 && diasTranscurridos < 65;

    const dentroDe90a95 = diasTranscurridos > 90 && diasTranscurridos < 95;


    return {
        dentroDe8a15,
        dentroDe23a30,
        dentroDe53a60,
        dentroDe83a90,
        dentroDe15a20,
        dentroDe30a35,
        dentroDe60a65,
        dentroDe90a95
    };
}

function obtenerRangoSemanaAntesDelMes(fechaReferencia, meses) {
  const año = fechaReferencia.getFullYear();
  const mes = fechaReferencia.getMonth() + meses; // mes siguiente
  const day = fechaReferencia.getDate() + 1;

  // Si es diciembre, saltamos a enero del siguiente año
  const fechaInicioMesSiguiente = new Date(año, mes === 12 ? 0 : mes, day);
  if (mes === 12) fechaInicioMesSiguiente.setFullYear(año + 1);

  const fechaInicioRango = new Date(fechaInicioMesSiguiente);
  
  fechaInicioRango.setDate(fechaInicioRango.getDate() - 7);
  

  return {
    desde: fechaInicioRango,
    hasta: fechaInicioMesSiguiente
  };
}

// Example usage:
const currentDate = new Date(); // Get the current date
const formattedDate = formatDateToYYYYMMDD(currentDate);
console.log(formattedDate); // Output: e.g., 2025/07/15

/*

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

*/



export default controller;