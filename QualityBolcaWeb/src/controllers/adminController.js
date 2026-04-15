import Sequelize from 'sequelize'
import db from "../config/db.js";
import { Op, QueryTypes } from 'sequelize'
import { emailMantenimientoA, emailMejora } from "../helpers/emails.js";
import modelosSistemas from '../models/sistemas/barril_modelos_sistemas.js';
import modelosGenerales from '../models/generales/barrilModelosGenerales.js';

// const __filename = fileURLToPath(import.meta.url); // obtener la ruta resuelta al archivo 
// const __dirname = path.dirname(__filename); // obtener el nombre del directorio
import RegistroMa from "../models/registroma.js";
import {format } from "@formkit/tempo"

const controller = {};

// controller.inicio = (req, res) => { //controlador de inicio del proyecto
//     if (req.originalUrl) {
//         res.redirect(req.originalUrl);
//     } else {
//         res.render('admin/inicio')
//     }
// }

controller.directorio = async (req, res) => {
    const Rcomunicacion2 = await db.query(
        `SELECT c.correo, c.telefono, e.*, u.fotografia
         FROM comunicacions c
         right JOIN empleados e ON c.id = e.codigoempleado
         left JOIN usuarios u on c.id = u.codigoempleado
         order by apellidopaterno asc;
         `,
        {
            type: QueryTypes.SELECT // Tipo de consulta: SELECT
        }
    )
    res.render('admin/directorio', {
        Rcomunicacion2
    })
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
}

controller.subiranalisis = async (req, res) => {
    const { mejoraid } = req.params
    const obtenerAnalisis = await Mejora.findByPk(mejoraid);
    if (!obtenerAnalisis || obtenerAnalisis.estatus != 0) {
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
        obtenerAnalisis.fecha = format(new Date(), 'YYYY-MM-DD')
        await obtenerAnalisis.save();
        await emailMejora(obtenerAnalisis);
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

controller.valeresguardo = async (req, res) => {
    let valeasignacion
    const { codigoempleado } = req.usuario
    const obtenerFolio = await  modelosSistemas.vales.findOne({ where: { numeroEmpleado: codigoempleado } });
    if(!obtenerFolio) return res.json({msg: `no hay vale`})
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
        //next()
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
    const obtenerNombre = await modelosGenerales.modelonom10001.findOne({ attributes: ['nombrelargo'], where: { codigoempleado: codigoempleado } });
    res.render('admin/mantenimientoautonomo', {
        csrfToken: req.csrfToken(),
        obtenerNombre
    })
}

controller.mantenimientoautonomo2 = async (req, res) => {

    const { nombre, tipo, region, respuestas } = req.body

    const registromantenimiento = await registroma.findOne({ where: { nombre: nombre } });

    if (registromantenimiento) {
        try {

            await registroma.update(
                { tipo, region, respuestas },
                { where: { nombre } }
            )
            // Enviar email de confirmacion
            await emailMantenimientoA({ region, respuestas, tipo, nombre })

            res.status(200).send({ msg: 'Mantenimiento enviado', ok: true });
            return
        } catch (error) {
            console.error("Error al enviar correo o guardar datos:", error);
            res.status(400).send({ msg: error, ok: false });
            return
        }
    } else {
        try {

            await registroma.create(
                { nombre, tipo, region, respuestas }
            )
            // Enviar email de confirmacion
            await emailMantenimientoA({ region, respuestas, tipo, nombre })

            res.status(200).send({ msg: 'Mantenimiento enviado', ok: true });
            return
        } catch (error) {
            console.error("Error al enviar correo o guardar datos:", error);
            res.status(400).send({ msg: error, ok: false });
            return
        }
    }
}

export default controller;