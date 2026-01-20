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
    Vales,
    Usuario
} from "../models/index.js";

import { Op, QueryTypes, where } from 'sequelize'
import { cat } from "@xenova/transformers";
import Informaciongch from "../models/informaciongch.js";
import Informaciondepartamento from "../models/informaciondepartamento.js";

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

    res.render('admin/sistemas/programamantenimiento', {
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

controller.inicio = (req, res) => {
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
controller.crearVale = async (req, res) => {
    try {
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
            { folio: siguienteFolio },
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
controller.darBajaVale = async (req, res) => {
    const { folio } = req.params;

    try {
        //buscar el inventario que coincide con el folio
        const inventarios = await Inventario.findAll({
            where: { folio: folio }
        });

        if (inventarios.length === 0) {
            return res.json({ ok: false, message: `No existe inventario con folio ${folio}` });
        }

        //Actualizar cambio de firma en null para la tabla de vales
        await Vales.update(
            { Firma: null },
            { where: { idFolio: folio } }
        )

        //Actualizar el inventario en 0 todos los registros encontrados
        await Inventario.update(
            { folio: 0 },
            { where: { folio: folio } }
        );

        return res.json({ ok: true, message: "Todos los objetos del inventario fueron dados de baja correctamente" });

    } catch (error) {
        console.log('Error al dar de baja el vale', error);
        return res.status(500).json({ ok: false, message: error.message })
    }
}

controller.inventarioDisponible = async (req, res) => {
    try {
        const equipos = await Inventario.findAll({
            where: {
                folio: 0
            }
        });

        return res.json(equipos);
    } catch (error) {
        console.error("Error al obtener inventario disponible:", error);
        return res.status(500), json({
            ok: false,
            message: "Error al obtener inventario disponible"
        })
    }
}

controller.agregarEquipos = async (req, res) => {
    const { folio } = req.params;
    const { equipos } = req.body;

    if (!equipos || equipos.length === 0) {
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

controller.equiposAsignados = async (req, res) => {   //obtener equipos asignados
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

controller.removerEquipos = async (req, res) => {
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

        return res.json({ ok: true, message: "Equipos removidos correctamente." });

    } catch (error) {
        console.error("ERROR removiendo equipos:", error);
        return res.status(500).json({
            ok: false,
            message: "Error inesperado al remover equipos."
        });
    }
};

//controladores de tickets
controller.levantamientoTicket = async (req, res) => {
    try {
        const { codigoempleado } = req.usuario;
        const usuario = await Usuario.findOne({
            where: { codigoempleado }
        });

        const empleado = await Informaciongch.findOne({
            where: { codigoempleado }
        });

        if (!usuario || !empleado) {
            return res.status(404).send("Usuario no encontrado");
        }

        // buscar el nombre del departamento
        const departamento = await db.query(
            `
            SELECT descripcion 
            FROM nom10003 
            WHERE iddepartamento = :iddepartamento
            LIMIT 1
            `,
            {
                replacements: { iddepartamento: empleado.iddepartamento },
                type: QueryTypes.SELECT
            }
        );

        const datosUsuario = {
            codigoempleado,
            nombreCompleto: empleado.nombrelargo,
            departamento: departamento.length > 0 ? departamento[0].descripcion : 'Desconocido',
            puesto: empleado.idpuesto
        };

        console.log('Datos Usuario:', datosUsuario);

        res.render('admin/sistemas/levantamiento_ticket.ejs', {
            info: datosUsuario,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error("Error al cargar el formulario de ticket:", error);
        res.status(500).send("Error interno del servidor");
    }
};

controller.formularioTicket = async (req, res) => {
    try {
        const { codigoempleado } = req.usuario;
        const usuario = await Usuario.findOne({
            where: { codigoempleado }
        });

        const empleado = await Informaciongch.findOne({
            where: { codigoempleado }
        });

        if (!usuario || !empleado) {
            return res.status(404).send("Usuario no encontrado");
        }

        const datosUsuario = {
            codigoempleado,
            nombreCompleto: empleado.nombrelargo,
            departamento: empleado.iddepartamento,
            puesto: empleado.puesto
        };

        console.log('Datos Usuario:', datosUsuario);

        res.render('admin/sistemas/levantamiento_ticket.ejs', {
            info: datosUsuario,
            csrfToken: req.csrfToken()
        });

    } catch (error) {
        console.error("Error al cargar el formulario de ticket:", error);
        res.status(500).send("Error interno del servidor");
    }
}

function obtenerHorasPorPrioridad(prioridad) {
    switch(prioridad) {
        case 'low':
            return 72;
        case 'medium':
            return 48;
        case 'high':
            return 24;
        case 'critical':
            return 8;
        default:
            return 72;
    }
}

controller.crudTickets = async (req, res) => {
    //console.log('ENTRÓ A crudTickets');
    //console.log(req.body);
    console.log('REQ.USUARIO:', req.usuario);
    //console.log('SESSION:', req.session);
    //console.log('SESSION USUARIO:', req.session.usuario);
    try {
        //  LISTAR TICKETS (GET)
        if (req.method === 'GET') {
            const tickets = await modelosSistemas.modeloTickets.findAll({
                order: [['id', 'DESC']]
            });

            const ticketsParseados = tickets.map(t => ({
                ...t.toJSON(),
                datosTicket: typeof t.datosTicket === 'string'
                    ? JSON.parse(t.datosTicket)
                    : t.datosTicket
            }));

            return res.json({
                ok: true,
                tickets: ticketsParseados
            });
        }

        //  OPERACIONES POST (crear / actualizar / borrar)
        const { tipo, id, datosTicket, folio } = req.body;

        switch (tipo) {
            case 'insert': {
                const ticketParseado = typeof datosTicket === 'string'
                    ? JSON.parse(datosTicket)
                    : datosTicket;

                if (!req.usuario) {
                    return res.status(401).json({ ok: false, message: 'sesión no valida' });
                }

                const { codigoempleado } = req.usuario;

                const empleado = await Informaciongch.findOne({
                    where: { codigoempleado }
                });

                if (!empleado) {
                    return res.status(404).json({ ok: false, message: 'Empleado no encontrado' });
                }

                //nombre del departamento
                const departamentoDB = await db.query(
                    `
                    SELECT descripcion 
                    FROM nom10003 
                    WHERE iddepartamento = :iddepartamento
                    LIMIT 1
                    `,
                    {
                        replacements: { iddepartamento: empleado.iddepartamento },
                        type: QueryTypes.SELECT
                    }
                );

                // inyectar datos al ticket
                ticketParseado.nombreUsuario = empleado.nombrelargo;
                ticketParseado.departamento = departamentoDB.length > 0 ? departamentoDB[0].descripcion : 'Desconocido';
                ticketParseado.codigoEmpleado = codigoempleado;
                ticketParseado.estatus = ticketParseado.status || 'open';
                ticketParseado.slaHoras = obtenerHorasPorPrioridad(ticketParseado.prioridad);
                ticketParseado.slaConsumido = 0;
                ticketParseado.slaInicio = null;
                ticketParseado.slaFin = null;
                ticketParseado.slaActivo = false;


                const nuevoTicket = await modelosSistemas.modeloTickets.create({
                    folio,
                    datosTicket: ticketParseado
                });

                return res.json({ ok: true, ticket: nuevoTicket });

            }

            case 'delete':
                // lógica después
                return res.json({ ok: true });

            case 'update':
                // lógica después
                return res.json({ ok: true });

            default:
                return res.status(400).json({ ok: false, message: 'Tipo inválido' });
        }

    } catch (error) {
        console.error('Error en crudTickets:', error);
        return res.status(500).json({ ok: false });
    }
}
controller.administracionTickets = (req, res) => {
    try {
        return res.render('admin/sistemas/administracion_tickets.ejs', {
            csrfToken: req.csrfToken()
        });
        // res.send('vista de tickets')
    } catch (error) {
        console.error('Error cargando administración de tickets:', error);
        return res.status(500).send('Error interno');
    }
}

controller.asignarTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { asignadoA } = req.body;

        const ticket = await modelosSistemas.modeloTickets.findOne({
            where: { folio: id }
        });

        if (!ticket) {
            return res.status(404).json({
                ok: false,
                message: 'Ticket no encontrado'
            });
        }

        // Parsear datosTicket si viene como string
        let datos = ticket.datosTicket;
        if (typeof datos === 'string') {
            datos = JSON.parse(datos);
        }

        // Validaciones
        if (datos.estatus !== 'open') {
            return res.status(400).json({
                ok: false,
                message: 'El ticket no puede asignarse en este estado'
            });
        }

        // Actualizar datos
        datos.asignadoA = asignadoA;
        datos.estatus = 'progress';
        datos.slaConsumido = datos.slaConsumido || 0;
        datos.slaInicio = Date.now();
        datos.slaActivo = true;


        ticket.datosTicket = datos;
        await ticket.save();

        return res.json({ ok: true });

    } catch (error) {
        console.error('❌ Error asignando ticket:', error);
        return res.status(500).json({
            ok: false,
            message: 'Error interno del servidor'
        });
    }
};

controller.pausarTicket = async (req, res) => {   //pausar ticket
    try {
        const { id } = req.params;

        const ticket = await modelosSistemas.modeloTickets.findOne({
            where: { folio: id }
        });

        if (!ticket) {
            return res.status(404).json({ ok: false });
        }

        const datos = parseDatosTicket(ticket);

        if (datos.estatus !== 'progress') {
            return res.status(400).json({
                ok: false,
                msg: 'El ticket no está en progreso'
            });
        }

        // sumar tiempo consumido
        const ahora = Date.now();
        const inicio = new Date(datos.slaInicio).getTime();
        datos.slaConsumido += Math.floor((ahora - inicio) / 1000);

        datos.estatus = 'pending';
        datos.slaActivo = false;
        datos.slaInicio = null;

        ticket.datosTicket = datos;
        await ticket.save();

        res.json({ ok: true });

    } catch (error) {
        console.error('Error pausar ticket:', error);
        res.status(500).json({ ok: false });
    }
};

controller.reanudarTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await modelosSistemas.modeloTickets.findOne({
            where: { folio: id }
        });

        if (!ticket) {
            return res.status(404).json({ ok: false });
        }

        const datos = parseDatosTicket(ticket);

        if (datos.estatus !== 'pending') {
            return res.status(400).json({
                ok: false,
                msg: 'El ticket no está en pendiente'
            });
        }

        datos.estatus = 'progress';
        datos.slaActivo = true;
        datos.slaInicio = Date.now();

        ticket.datosTicket = datos;
        await ticket.save();

        res.json({ ok: true });

    } catch (error) {
        console.error('❌ Error reanudar ticket:', error);
        res.status(500).json({ ok: false });
    }
};

controller.terminarTicket = async (req, res) => {  //terminar ticket
    try {
        const { id } = req.params;

        const ticket = await modelosSistemas.modeloTickets.findOne({
            where: { folio: id }
        });

        if (!ticket) {
            return res.status(404).json({ ok: false });
        }

        const datos = parseDatosTicket(ticket);

        if (datos.estatus !== 'progress') {
            return res.status(400).json({
                ok: false,
                msg: 'Solo se pueden terminar tickets en progreso'
            });
        }

        // cerrar SLA
        const ahora = Date.now();
        const inicio = new Date(datos.slaInicio).getTime();
        datos.slaConsumido += Math.floor((ahora - inicio) / 1000);

        datos.estatus = 'resolved';
        datos.slaActivo = false;
        datos.slaFin = Date.now();
        datos.slaInicio = null;

        ticket.datosTicket = datos;
        await ticket.save();

        res.json({ ok: true });

    } catch (error) {
        console.error('Error terminar ticket:', error);
        res.status(500).json({ ok: false });
    }
};

controller.cerrarTicket = async (req, res) => {
    const { id } = req.params; // viene como :id en la ruta

    try {
        const ticket = await modelosSistemas.modeloTickets.findOne({
            where: { folio: id }
        });

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket no encontrado' });
        }

        // Parsear datosTicket
        let datos = ticket.datosTicket;
        if (typeof datos === 'string') {
            datos = JSON.parse(datos);
        }

        // Validar estatus
        if (datos.estatus !== 'resolved') {
            return res.status(400).json({
                message: 'Solo se pueden cerrar tickets resueltos'
            });
        }

        // Estado final
        datos.estatus = 'closed';
        datos.slaActivo = false;
        datos.slaFin = Date.now();
        datos.slaInicio = null;

        ticket.datosTicket = datos;
        await ticket.save();

        return res.json({ ok: true, message: 'Ticket cerrado correctamente' });

    } catch (error) {
        console.error('Error al cerrar el ticket:', error);
        return res.status(500).json({ ok: false });
    }
};


//controladores de inventario
controller.inventario = async (req, res) => {
    res.render('admin/sistemas/inventario.ejs')
}

function parseDatosTicket(ticket) {
    return typeof ticket.datosTicket === 'string'
        ? JSON.parse(ticket.datosTicket)
        : ticket.datosTicket;
}


export default controller;