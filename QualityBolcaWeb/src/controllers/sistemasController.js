import express from "express";
import sequelizeClase from "../public/clases/sequelize_clase.js";
import db from "../config/db.js";
import modelosSistemas from "../models/sistemas/barril_modelos_sistemas.js";


import {
    registroma,
    informaciongch,
    informacionpuesto,
    Inventario,
    Solicitudservicio,
    Vales
} from "../models/index.js";

import { Op, QueryTypes, where } from 'sequelize'
import { cat } from "@xenova/transformers";

const app = express();

const controller = {};

controller.registroMA = async (req, res) => {
    const registro = await registroma.findAll();
    const resultador = JSON.stringify(registro, null, 2)
    res.render('admin/sistemas/registromati', {
        resultador
    });
}
controller.addinventario = async (req, res) => {

    res.render('admin/sistemas/addinventario', {
        csrfToken: req.csrfToken()
    });
}

controller.addinventario2 = async (req, res) => {

    const {
        idInventario,
        tipo,
        marca,
        serie,
        folio,
        estado,
        precio,
        fechaCompra,
        fechaEntrega,
        usoExclusivo,
        accesorios,
        comentarios,
        codigoResguardo,
        ultimoMantenimiento
    } = req.body

    const InventarioR = await Inventario.create({
        idInventario,
        tipo,
        marca,
        serie,
        folio,
        estado,
        precio,
        fechaCompra,
        fechaEntrega,
        usoExclusivo,
        accesorios,
        comentarios,
        codigoResguardo,
        ultimoMantenimiento
    })

    res.status(200).send({ ok: true });
    return
}


controller.tablainventario = async (req, res) => {

    res.render('admin/sistemas/tablainventario');
}

controller.api = async (req, res) => {
    const { query2 } = req.params
    let valeasignacion
    // const resultado = await db.query(
    //     `SELECT i.*, v.*, n1.nombrelargo, n6.descripcion
    //      FROM inventario i
    //      INNER JOIN vales v ON i.folio = v.idfolio
    //      INNER JOIN nom10001 n1 ON n1.codigoempleado = v.numeroEmpleado
    //      INNER JOIN nom10006 n6 ON n1.idpuesto = n6.idpuesto
    //      WHERE i.folio = :nfolio;`,
    //     {
    //       replacements: { nfolio: '40' }, // Sustituir parámetros
    //       type: QueryTypes.SELECT // Tipo de consulta: SELECT
    //     }
    //   )
    const resultado = await db.query(
        query2,
        {
            //   replacements: { nfolio: '40' }, // Sustituir parámetros
            type: QueryTypes.SELECT // Tipo de consulta: SELECT
        }
    )
        .then((resultados) => {
            valeasignacion = resultados;
        });



    // res.render('admin/valeresguardo',{
    //     csrfToken: req.csrfToken(),
    //     valeasignacion
    // })
    res.send(valeasignacion)
}

controller.addvales = async (req, res) => {

    res.render('admin/sistemas/addvales', {
        csrfToken: req.csrfToken()
    });
}


controller.addvales2 = async (req, res) => {

    const {
        idFolio,
        numeroEmpleado,
        fechaFolio
    } = req.body

    const valesR = await Vales.create({
        idFolio,
        numeroEmpleado,
        fechaFolio
    })

    res.status(200).send({ ok: true });
    return
}
controller.registromantenimiento = async (req, res) => {
    let valeasignacion;

    const resultado = await db.query(
        `SELECT i.*, v.*, n1.nombrelargo, n6.descripcion
         FROM inventario i
         
         left JOIN vales v ON i.folio = v.idfolio
         right JOIN nom10001 n1 ON n1.codigoempleado = v.numeroEmpleado
         left JOIN nom10006 n6 ON n1.idpuesto = n6.idpuesto
         where tipo = 'Laptop' or tipo = 'Ensamblado' or tipo = 'Allinone'
         order by idInventario asc;`,
        {
            type: QueryTypes.SELECT // Tipo de consulta: SELECT
        }
    ).then((resultados) => {
        valeasignacion = resultados;
    });

    // res.send({valeasignacion});

    res.render('admin/sistemas/registromantenimiento', {
        csrfToken: req.csrfToken(),
        valeasignacion,
        resultado
    })
}

controller.programamantenimiento = async (req, res) => {

    let programaResultados

    const resultados = await db.query(
        `
        SELECT i.idInventario, i.marca, i.tipo, i.usoExclusivo, i.ultimoMantenimiento, i.fechaCompra,
        n1.nombrelargo, n3.descripcion region FROM qualitybolca.inventario i
        left join vales v on i.folio = v.idFolio
        inner join nom10001 n1 on v.numeroEmpleado = n1.codigoempleado
        right join nom10003 n3 on n1.iddepartamento = n3.iddepartamento
        where tipo IN ('Allinone','Laptop','Ensamblado')
        order by idInventario;
        `,
        {
            type: QueryTypes.SELECT // Tipo de consulta: SELECT
        }
    ).then((resultados) => {
        programaResultados = resultados;
    });

    res.render('admin/sistemas/programamantenimiento',{
        csrfToken: req.csrfToken(),
        programaResultados
    });
}

controller.listadopersonal = async (req, res) => {
    let personal2
    const personal = await db.query(
        `
            SELECT 
            GROUP_CONCAT(i.idInventario) AS idInventario_concat, 
            GROUP_CONCAT(i.tipo) AS tipo_concat, 
            GROUP_CONCAT(i.marca) AS marca_concat, 
            GROUP_CONCAT(i.serie) AS serie,
            GROUP_CONCAT(i.estado) AS estado,
            GROUP_CONCAT(i.accesorios) AS accesorios,
            GROUP_CONCAT(i.detalles) AS detalles,
            MAX(i.historial) AS historial, 
            MAX(v.firma) AS firma, 
            n1.nombrelargo, 
            i.usoExclusivo,
            i.folio,
            i.fechaEntrega,
            v.numeroEmpleado,
            v.fechaFolio,
            MAX(n6.descripcion) AS descripcion
            FROM inventario i
            LEFT JOIN vales v ON i.folio = v.idfolio
            INNER JOIN nom10001 n1 ON n1.codigoempleado = v.numeroEmpleado
            INNER JOIN nom10006 n6 ON n1.idpuesto = n6.idpuesto
            GROUP BY n1.nombrelargo;
         `,
        {
            type: QueryTypes.SELECT // Tipo de consulta: SELECT
        }
    ).then((resultados) => {
        personal2 = resultados;
    });

    res.render('admin/sistemas/listadopersonal', {
        csrfToken: req.csrfToken(),
        personal2
    });
}
controller.listadosolicitudes = async (req, res) => {
    let listadoSolicitudes
    let cuentaDatos

    const personal = await Solicitudservicio.findAll(
    ).then((resultados) => {
        listadoSolicitudes = resultados;
    });

    res.render('admin/sistemas/solicitudes', {
        csrfToken: req.csrfToken(),
        listadoSolicitudes
    });
}

controller.mantenimientoautonomo = async (req, res) => {
    let matenimientos
    let cuentaDatos

    const personal = await registroma.findAll()
        .then((resultados) => {
            matenimientos = resultados;
        });

    res.render('admin/sistemas/mantenimientoautonomo', {
        csrfToken: req.csrfToken(),
        matenimientos
    });
}

controller.inicio = (req, res)=>{
    try {
        return res.render('admin/sistemas/mio/inicio_sistemas.ejs')
    } catch (error) {
        
    }
}

//Jalar los usuarios sin vale creado
controller.obtenerColaboradoresSinVale = async (req, res) => {
    try {
        // Obtener todos los números de empleado que ya tienen vale
        const vales = await Vales.findAll({
            attributes: ['numeroEmpleado']
        });

        const empleadosConVale = vales.map(v => v.numeroEmpleado);

        const colaboradores = await informaciongch.findAll({
            where: {
                codigoempleado: {
                    [Op.notIn]: empleadosConVale.length > 0 ? empleadosConVale : ['']
                }
            },
            attributes: [
                'idempleado',
                'codigoempleado',
                'nombrelargo',
                'iddepartamento',
                'jefeDirecto',
                'esBecario'
            ]
        });

        return res.json(colaboradores);

    } catch (error) {
        console.error("Error obteniendo colaboradores sin vale:", error);
        return res.status(500).json({ message: "Error al obtener colaboradores sin vale" });
    }
}

//controlador de crear nuevo Vale
controller.crearVale = async(req, res) => {
    try{
        const { numeroEmpleado, equipos } = req.body;

        if (!numeroEmpleado || !equipos || equipos.length === 0) {
            return res.status(400).json({ message: "numeroEmpleado es requerido" });
        }

        // 1. Obtener el siguiente idFolio
        const ultimoVale = await Vales.findOne({
            order: [['idFolio', 'DESC']]
        });

        const siguienteFolio = ultimoVale ? ultimoVale.idFolio + 1 : 1;

        // 2. Fecha actual en formato YYYY-MM-DD
        const hoy = new Date().toISOString().split("T")[0];

        // 3. Crear el vale
        const nuevoVale = await Vales.create({
            idFolio: siguienteFolio,
            numeroEmpleado: numeroEmpleado,
            fechaFolio: hoy,
            Firma: null,
            comentarios: null
        });

        //Asignar el folio a los equipos
        await Inventario.update(
            {folio: siguienteFolio },
            {
                where: {
                    idInventario: equipos
                }
            }
        );

        return res.json({
            ok: true,
            message: "Vale creado y equipos asignados correctamente",
            vale: nuevoVale
        });
    } catch (error) {
        console.error("❌ Error al crear vale:", error);
        return res.status(500).json({ message: "Error al crear vale" });
    }
}

//controladores de baja de vale
controller.darBajaVale = async(req, res) => {
    const { folio } = req.params;

    try {
        //buscar el inventario que coincide con el folio
        const inventarios = await Inventario.findAll({
            where: { folio: folio }
        });

        if (inventarios.length === 0) {
            return res.json({ ok:false, message: `No existe inventario con folio ${folio}`});
        }

        //Actualizar cambio de firma en null para la tabla de vales
        await Vales.update(
            { Firma: null},
            {where: {idFolio: folio}}
        )

        //Actualizar el inventario en 0 todos los registros encontrados
        await Inventario.update(
            {folio: 0},
            {where: { folio: folio} }
        );

        return res.json({ ok: true, message: "Todos los objetos del inventario fueron dados de baja correctamente" });

    } catch (error) {
        console.log('Error al dar de baja el vale', error);
        return res.status(500).json({ok: false, message: error.message})
    }
}

controller.inventarioDisponible = async(req, res) => {
    try{
        const equipos = await Inventario.findAll({
            where: {
                folio: 0
            }
        });
        
        return res.json(equipos);
    } catch (error) {
        console.error("Error al obtener inventario disponible:", error);
        return res.status(500),json({
            ok: false,
            message: "Error al obtener inventario disponible"
        })
    }
}

controller.agregarEquipos = async(req, res) => {
    const { folio } = req.params;
    const { equipos } = req.body;

    if(!equipos || equipos.length === 0){
        return res.status(400).json({
            ok: false,
            message: "No se recibieron equipos para asignar."
        });
    }

    try {
        // 1. Validar que el vale existe
        const vale = await Vales.findOne({ where: { idFolio: folio } });

        if (!vale) {
            return res.status(404).json({
                ok: false,
                message: "El folio del vale no existe."
            });
        }

        // 2. Asignar los equipos al vale
        await Inventario.update(
            { folio: folio },               // se asigna el folio
            { where: { idInventario: equipos } } // se asignan todos los seleccionados
        );

        return res.json({
            ok: true,
            message: "Equipos asignados correctamente."
        });

    } catch (error) {
        console.error("Error al agregar equipos:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor."
        });
    }
}

controller.equiposAsignados = async(req, res) => {   //obtener equipos asignados
    const { folio } = req.params;

    try {
        const equipos = await Inventario.findAll({
            where: {
                folio: folio
            }
        });

        return res.json(equipos);

    } catch (error) {
        console.error("ERROR obteniendo equipos asignados:", error);
        return res.status(500).json({ message: "Error al obtener los equipos asignados." });
    }
};

controller.removerEquipos = async(req, res) => {
    const { folio } = req.params;
    const { equipos } = req.body;

    if (!equipos || equipos.length === 0) {
        return res.status(400).json({ ok: false, message: "No se enviaron equipos a remover." });
    }

    try {
        await Inventario.update(
            { folio: 0 },
            {
                where: {
                    idInventario: equipos,
                    folio: folio
                }
            }
        );

        return res.json({ ok: true, message: "Equipos removidos correctamente."});

    } catch (error) {
        console.error("ERROR removiendo equipos:", error);
        return res.status(500).json({
            ok: false,
            message: "Error inesperado al remover equipos."
        });
    }
};

//controladores de tickets
controller.levantamientoTicket = async(req, res)=>{
    try {
        const tok = req.csrfToken()
        res.render('admin/sistemas/levantamiento_ticket.ejs', {tok: tok})
    } catch (error) {
        
    }
}

controller.crudTickets = async (req, res) => {
    let clase = new sequelizeClase({modelo: modelosSistemas.modeloTickets})
    let {tipo, id, datosTicket, folio} = req.body;
    let usuario = req.usuario;
    let campos = {
        folio: folio,
        datosTicket: JSON.parse(datosTicket)
    }
    console.log(usuario)
    switch(tipo){
        case 'insert':
            return res.json({ok: await clase.insertar({datosInsertar: campos, msg: `ticket levantado con exito, el folio de tu ticket es: ` })})
        case 'delete':
            if(!id) return res.json({})
        case 'update':

    }
}
controller.administracionTickets = (req, res) => {
    try {
        return res.render('admin/sistemas/administracion_tickets.ejs')
        // res.send('vista de tickets')

    } catch (error) {
        
    }
}

//controladores de inventario
controller.inventario = async (req, res) => {
    res.render('admin/sistemas/inventario.ejs')
}
export default controller;