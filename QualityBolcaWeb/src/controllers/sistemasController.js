import sequelizeClase from "../public/clases/sequelize_clase.js";
import db from "../config/db.js";
import modelosSistemas from "../models/sistemas/barril_modelos_sistemas.js";
import modelosGenerales from "../models/generales/barrilModelosGenerales.js";
import manejadrorErrores from "../middleware/manejadorErrores.js";
import miNodemailer from "../public/clases/nodemailer.js";
import { Op, QueryTypes } from 'sequelize'
import dbSistemas from "../config/dbSistemas.js";


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

    const InventarioR = await modelosSistemas.inventario.create({
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
    if(!InventarioR){
        res.status(400).send({ ok: false });
        return
    }
    res.status(200).send({ ok: true });
    return
}


controller.tablainventario = async (req, res) => {

    res.render('admin/sistemas/tablainventario');
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

    const valesR = await modelosSistemas.vales.create({
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

controller.dashboardTI = async (req, res) => {
    try {
        const { codigoempleado } = req.usuario;

        const empleado = await db.query(
            `
                SELECT 
                    n.nombre,
                    n.apellidopaterno,
                    n.nombrelargo,
                    p.descripcion AS puesto
                FROM nom10001 n
                LEFT JOIN nom10006 p
                    ON n.idpuesto = p.idpuesto
                WHERE n.codigoempleado = :codigoempleado
                LIMIT 1
                `,
            {
                replacements: { codigoempleado },
                type: QueryTypes.SELECT
            }
        );

        let nombreUsuario = 'Usuario';
        let puestoUsuario = 'Sin puesto';
        let fullName = "";

        if (empleado.length > 0) {
            const emp = empleado[0];

            nombreUsuario = emp.nombrelargo
                || `${emp.nombre} ${emp.apellidopaterno}`;

            puestoUsuario = emp.puesto || 'Sin puesto';
        }

        fullName = nombreUsuario.split(" ");
        nombreUsuario = fullName[2] + " " + fullName[0]

        /*  Inventario Total */
        const totalInventario = await db.query(
            `SELECT COUNT(*) AS total FROM inventario`,
            { type: QueryTypes.SELECT }
        );

        /* Obtener todos los tickets */
        const ticketsDB = await modelosSistemas.modeloTickets.findAll();

        const ticketsProcesados = ticketsDB.map(t => {
            const datos = typeof t.datosTicket === 'string'
                ? JSON.parse(t.datosTicket)
                : t.datosTicket;

            return {
                folio: t.folio,
                titulo: datos.titulo,
                estatus: datos.estatus?.toLowerCase(),
                tecnico: datos.asignadoA || 'Sin asignar',
                fecha: t.createdAt
            };
        });



        /* Contar tickets abiertos */
        const ticketsAbiertos = ticketsProcesados.filter(t =>
            ['open', 'progress', 'pending'].includes(t.estatus)
        ).length;

        /* Últimos 5 tickets */
        const ultimosTickets = ticketsProcesados
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .slice(0, 5);

        /* Usuarios activos */
        const usuariosActivos = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM nom10001
            WHERE estadoempleado = 'A'
            `,
            { type: QueryTypes.SELECT }
        );

        /* Usuarios totales */
        const usuariosTotales = await db.query(
            `
            SELECT COUNT(*) AS total from nom10001
            `,
            { type: QueryTypes.SELECT }
        )

        /* Vales existentes */
        const valesExistentes = await db.query(
            `SELECT COUNT(*) AS total FROM vales`,
            { type: QueryTypes.SELECT }
        );

        /*  Últimas requisiciones */
        const ultimasRequisiciones = await dbSistemas.query(
            `
            SELECT 
                id,
                requesterName,
                JSON_UNQUOTE(JSON_EXTRACT(items, '$[0].equipment')) AS equipment,
                status
            FROM requisicionEquipos
            ORDER BY createdAt DESC
            LIMIT 5
            `,
            { type: QueryTypes.SELECT }
        );

        const ultimasRequisicionesFormateadas = ultimasRequisiciones.map(req => {
            if (!req.requesterName) return req;

            const partes = req.requesterName.trim().split(/\s+/);

            let nombreCorto = req.requesterName;

            if (partes.length >= 3) {
                const primerApellido = partes[0];
                const primerNombre = partes[2];
                nombreCorto = `${primerNombre} ${primerApellido}`;
            }

            return {
                ...req,
                requesterName: nombreCorto
            };
        });

        return res.render('admin/sistemas/dashboard.ejs', {
            inventarioTotal: totalInventario[0].total,
            ticketsAbiertos,
            usuariosActivos: usuariosActivos[0].total,
            usuariosTotales: usuariosTotales[0].total,
            valesExistentes: valesExistentes[0].total,
            ultimosTickets,
            ultimasRequisiciones: ultimasRequisicionesFormateadas,
            nombreUsuario: nombreUsuario,
            puestoUsuario: puestoUsuario
        });

    } catch (error) {
        console.error('Error dashboard:', error);
    }
};

//Jalar los usuarios sin vale creado
controller.obtenerColaboradoresSinVale = async (req, res) => {
    try {
        // Obtener todos los números de empleado que ya tienen vale
        const vales = await modelosSistemas.vales.findAll({
            attributes: ['numeroEmpleado']
        });

        const empleadosConVale = vales.map(v => v.numeroEmpleado);

        const colaboradores = await modelosGenerales.modelonom10001.findAll({
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
        const ultimoVale = await modelosSistemas.vales.findOne({
            order: [['idFolio', 'DESC']]
        });

        const siguienteFolio = ultimoVale ? ultimoVale.idFolio + 1 : 1;

        // 2. Fecha actual en formato YYYY-MM-DD
        const hoy = new Date().toISOString().split("T")[0];

        // 3. Crear el vale
        const nuevoVale = await modelosSistemas.vales.create({
            idFolio: siguienteFolio,
            numeroEmpleado: numeroEmpleado,
            fechaFolio: hoy,
            Firma: null,
            comentarios: null
        });

        //Asignar el folio a los equipos
        await modelosSistemas.inventario.update(
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
        console.error("Error al crear vale:", error);
        return res.status(500).json({ message: "Error al crear vale" });
    }
}

//controladores de baja de vale
controller.darBajaVale = async (req, res) => {
    const { folio } = req.params;

    try {
        //buscar el inventario que coincide con el folio
        const inventarios = await modelosSistemas.inventario.findAll({
            where: { folio: folio }
        });

        if (inventarios.length === 0) {
            return res.json({ ok: false, message: `No existe inventario con folio ${folio}` });
        }

        //Actualizar cambio de firma en null para la tabla de vales
        await modelosSistemas.inventario.update(
            { Firma: null },
            { where: { idFolio: folio } }
        )

        //Actualizar el inventario en 0 todos los registros encontrados
        await modelosSistemas.inventario.update(
            { folio: 0 },
            { where: { folio: folio } }
        );

        return res.json({ ok: true, message: "Todos los objetos del inventario fueron dados de baja correctamente" });

    } catch (error) {
        console.error('Error al dar de baja el vale', error);
        return res.status(500).json({ ok: false, message: error.message })
    }
}

controller.inventarioDisponible = async (req, res) => {
    try {
        const equipos = await modelosSistemas.inventario.findAll({
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
        const vale = await modelosSistemas.vales.findOne({ where: { idFolio: folio } });

        if (!vale) {
            return res.status(404).json({
                ok: false,
                message: "El folio del vale no existe."
            });
        }

        // 2. Asignar los equipos al vale
        await modelosSistemas.inventario.update(
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
        const equipos = await modelosSistemas.inventario.findAll({
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
        await modelosSistemas.inventario.update(
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
        const usuario = await modelosGenerales.usuarios.findOne({
            where: { codigoempleado }
        });

        const empleado = await modelosGenerales.modelonom10001.findOne({
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
        const usuario = await modelosGenerales.usuarios.findOne({
            where: { codigoempleado }
        });

        const empleado = await modelosGenerales.modelonom10001.findOne({
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
    switch (prioridad) {
        case 'low':
            return 72;
        case 'medium':
            return 48;
        case 'high':
            return 24;
        case 'critical':
            return 2;
        default:
            return 72;
    }
}

controller.crudTickets = async (req, res) => {
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

                const empleado = await modelosGenerales.modelonom10001.findOne({
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

controller.misTickets = async (req, res) => {
    try {
        const { codigoempleado } = req.usuario;

        const empleado = await db.query(
            `
            SELECT nombre, apellidopaterno, nombrelargo
            FROM nom10001
            WHERE codigoempleado = :codigoempleado
            LIMIT 1
            `,
            {
                replacements: { codigoempleado },
                type: QueryTypes.SELECT
            }
        );

        const nombreUsuario = empleado.length > 0
            ? empleado[0].nombre
            || `${empleado[0].nombre} ${empleado[0].apellidopaterno}`
            : 'Usuario';

        const ticketsDB = await modelosSistemas.modeloTickets.findAll({
            order: [['createdAt', 'DESC']]
        });

        const misTickets = ticketsDB
            .map(t => {
                const datos = typeof t.datosTicket === 'string'
                    ? JSON.parse(t.datosTicket)
                    : t.datosTicket;

                return {
                    id: t.folio,
                    asunto: datos.titulo,
                    fecha: new Date(t.createdAt).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }),
                    estatus: normalizarEstatus(datos.estatus),
                    tecnico: datos.asignadoA
                        ? `Ing. ${datos.asignadoA}`
                        : 'Pendiente de asignar',
                    codigoEmpleado: datos.codigoEmpleado
                };
            })
            .filter(t => t.codigoEmpleado === codigoempleado);

        return res.render('admin/sistemas/misTickets.ejs', {
            csrfToken: req.csrfToken(),
            tickets: misTickets,
            nombreUsuario
        });

    } catch (error) {
        console.error('Error en misTickets:', error);
        return res.render('admin/sistemas/misTickets.ejs', {
            tickets: [],
            nombreUsuario: 'Usuario'
        });
    }
};

function normalizarEstatus(estatus) {
    switch (estatus) {
        case 'open': return 'abierto';
        case 'progress': return 'proceso';
        case 'pending': return 'pendiente';
        case 'resolved': return 'resuelto';
        case 'closed': return 'cerrado';
        default: return estatus;
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
        console.error('Error asignando ticket:', error);
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
        const ahora = new Date();
        const inicio = new Date(datos.slaInicio);
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

controller.agregarObservacionTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, mensaje } = req.body;

        if (!tipo || !mensaje) {
            return res.status(400).json({
                ok: false,
                msg: 'Tipo y mensaje son obligatorios'
            });
        }

        const ticket = await modelosSistemas.modeloTickets.findOne({
            where: { folio: id }
        });

        if (!ticket) {
            return res.status(404).json({
                ok: false,
                msg: 'Ticket no encontrado'
            });
        }

        const datos = parseDatosTicket(ticket);

        if (!Array.isArray(datos.observaciones)) {
            datos.observaciones = [];
        }

        datos.observaciones.push({
            tipo,
            mensaje,
            usuario: req.usuario?.nombre || req.usuario?.codigoempleado || 'Sistema',
            fecha: new Date()
        });

        // Ajustes según tipo
        if (tipo === 'pause' && datos.estatus === 'progress') {
            const ahora = new Date();
            const inicio = new Date(datos.slaInicio);
            datos.slaConsumido += Math.floor((ahora - inicio) / 1000);

            datos.estatus = 'pending';  //Aqui se pausa el ticket
            datos.slaActivo = false;
            datos.slaInicio = null;
        }

        if (tipo === 'resolve' && datos.estatus === 'progress') {
            const ahora = Date.now();
            const inicio = new Date(datos.slaInicio).getTime();
            datos.slaConsumido += Math.floor((ahora - inicio) / 1000);

            datos.estatus = 'resolved'; //Aqui se resuelve el ticket
            datos.slaActivo = false;
            datos.slaFin = new Date();
            datos.slaInicio = null;
        }

        ticket.datosTicket = datos;
        await ticket.save();

        return res.json({ ok: true });

    } catch (error) {
        console.error('Error agregando observación:', error);
        return res.status(500).json({ ok: false });
    }
}

controller.obtenerObservacionesTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo } = req.query;

        const ticket = await modelosSistemas.modeloTickets.findOne({
            where: { folio: id }
        });

        if (!ticket) {
            return res.status(404).json({
                ok: false,
                msg: 'Ticket no encontrado'
            });
        }

        const datos = parseDatosTicket(ticket);

        if (!Array.isArray(datos.observaciones)) {
            return res.json({
                ok: true,
                observaciones: []
            });
        }

        let observaciones = datos.observaciones;

        if (tipo) {
            observaciones = observaciones.filter(o => o.tipo === tipo);
        }

        return res.json({
            ok: true,
            total: observaciones.length,
            observaciones
        });

    } catch (error) {
        console.error('Error obteniendo observaciones del ticket:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }
};


//controladores de inventario
controller.inventario = async (req, res) => {
    res.render('admin/sistemas/inventario.ejs')
}

controller.obtenerInventario = async (req, res) => {
    try {
        const inventario = await db.query(`
            SELECT 
                i.idInventario,
                i.tipo,
                i.marca,
                i.serie,
                i.folio,
                i.estado,
                i.usoExclusivo,
                i.ultimoMantenimiento,
                i.fechaCompra,

                v.numeroEmpleado,

                CONCAT(n.nombre, ' ', n.apellidopaterno) AS asignadoA
            FROM inventario i
            LEFT JOIN vales v 
                ON i.folio = v.idFolio
            LEFT JOIN nom10001 n 
                ON v.numeroEmpleado = n.codigoempleado
            ORDER BY i.idInventario ASC;
        `, {
            type: QueryTypes.SELECT
        });

        return res.json({
            ok: true,
            inventario
        });
    } catch (error) {
        console.error('Error obteniendo inventario:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al obtener inventario'
        });
    }
}

//controlador de lista de usuarios (nom10001)
controller.usuarios = async (req, res) => {
    try {
        res.render('admin/sistemas/usuarios.ejs', {
            csrfToken: req.csrfToken()
        })
    } catch (error) {
        console.error("Error cargando usuarios: ", error);
    }
}

controller.obtenerDatosNuevoUsuario = async (req, res) => {
    try {

        const [[{ ultimoCodigo }]] = await db.query(
            `SELECT IFNULL(MAX(codigoempleado),0) AS ultimoCodigo FROM nom10001`
        );

        const ultimoCodigoInt = parseInt(ultimoCodigo) + 1;
        const ultimoCodigostr = ultimoCodigoInt.toString();
        
        const departamentos = await db.query(
            `SELECT iddepartamento, descripcion 
             FROM nom10003
             ORDER BY descripcion ASC`,
            { type: QueryTypes.SELECT }
        );

        const puestos = await db.query(
            `SELECT idpuesto, descripcion 
             FROM nom10006
             ORDER BY descripcion ASC`,
            { type: QueryTypes.SELECT }
        );

        return res.json({
            ok: true,
            siguienteCodigo: ultimoCodigostr,
            departamentos,
            puestos
        });

    } catch (error) {
        console.error("Error obteniendo datos de usuario:", error);
        return res.status(500).json({ ok: false });
    }
};

controller.actualizarUsuario = async (req, res) => {
    try {
        const { codigoempleado } = req.params;

        const {
            nombre,
            apellidopaterno,
            apellidomaterno,
            nombrelargo,
            correo,
            telefono,
            departamento,
            puesto
        } = req.body;

        if (!nombre || !apellidopaterno || !apellidomaterno || !nombrelargo || !correo || !departamento || !puesto) {
            return res.status(400).json({
                ok: false,
                msg: "Faltan campos obligatorios"
            })
        }

        const usuario = await db.query(
            `SELECT codigoempleado FROM nom10001 WHERE codigoempleado = :codigoempleado`,
            {
                replacements: { codigoempleado },
                type: QueryTypes.SELECT
            }
        );

        if (usuario.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado"
            });
        }

        await db.query(`
            UPDATE nom10001
            SET
                nombre = :nombre,
                apellidopaterno = :apellidopaterno,
                apellidomaterno = :apellidomaterno,
                nombrelargo = :nombrelargo,
                correoelectronico = :correo,
                telefono = :telefono,
                iddepartamento = :departamento,
                idpuesto = :puesto
            WHERE codigoempleado = :codigoempleado
        `, {
            replacements: {
                nombre,
                apellidopaterno,
                apellidomaterno,
                nombrelargo,
                correo,
                telefono,
                departamento,
                puesto,
                codigoempleado
            }
        });

        return res.json({
            ok: true,
            msg: "Usuario actualizado correctamente"
        });

    } catch (error) {
        console.error("Error actualizando usuario:", error);
        return res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

controller.obtenerUsuarios = async (req, res) => {
    try {

        const { search = "" } = req.query;

        const usuarios = await db.query(
            `
            SELECT 
                n.codigoempleado,
                n.nombrelargo,
                n.telefono,
                n.correoelectronico,
                n.estadoempleado,
                n.esBecario,
                n.iddepartamento,
                n.idpuesto,
                n6.descripcion AS puesto,
                n3.descripcion AS departamento
            FROM nom10001 n
            LEFT JOIN nom10006 n6
                ON n.idpuesto = n6.idpuesto
            LEFT JOIN nom10003 n3
                ON n.iddepartamento = n3.iddepartamento
            WHERE 
                n.nombrelargo LIKE :search
                OR n.correoelectronico LIKE :search
            ORDER BY n.nombrelargo ASC
            `,
            {
                replacements: {
                    search: `%${search}%`
                },
                type: QueryTypes.SELECT
            }
        );

        return res.json({
            ok: true,
            usuarios
        });

    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        return res.status(500).json({
            ok: false
        });
    }
};

//controladores gestion de usuarios
controller.adminUsuarios = async (req, res) => {
    try {

        const usuariosDB = await db.query(
            `
                SELECT 
                    u.codigoempleado,
                    ig.nombrelargo,
                    ig.correoelectronico AS email,
                    ig.estadoempleado,
                    n6.descripcion AS puesto,
                    n3.descripcion AS departamento,
                    u.permisos
                FROM usuarios u
                LEFT JOIN nom10001 ig 
                    ON u.codigoempleado = ig.codigoempleado
                LEFT JOIN nom10006 n6 
                    ON ig.idpuesto = n6.idpuesto
                LEFT JOIN nom10003 n3
                    ON ig.iddepartamento = n3.iddepartamento
                ORDER BY ig.nombrelargo;
            `,
            {
                type: QueryTypes.SELECT
            }
        );

        const usuarios = usuariosDB.map(u => {
            let rol = 'Sin permisos';
            let requisicionPermisos = [];

            if (u.permisos) {
                try {
                    const permisos = JSON.parse(u.permisos);
                    rol = permisos.roles?.join(', ') || 'Sin permisos';
                    requisicionPermisos = permisos.requisicionPermisos || [];
                } catch (e) {
                    rol = 'Sin permisos';
                    requisicionPermisos = [];
                }
            }

            return {
                codigoempleado: u.codigoempleado,
                nombre: u.nombrelargo || 'Sin información',
                puesto: u.puesto || 'Sin puesto',
                departamento: u.departamento || 'No asignado',
                email: u.email || 'No disponible',
                permisos: u.permisos,
                rol,
                requisicionPermisos,
                estadoempleado: u.estadoempleado || 'R'
            };
        });

        return res.render('admin/sistemas/adminUsuarios.ejs', {
            csrfToken: req.csrfToken(),
            usuarios
        });
    } catch (error) {
        console.error("Error cargando usuarios:", error);
        res.status(500).send("Error al cargar los usuarios");
    }
}

controller.actualizarPermisosUsuario = async (req, res) => {
    try {
        const { codigoempleado } = req.params;
        const { permisos } = req.body;

        if (!codigoempleado || !permisos) {
            return res.status(400).json({
                ok: false,
                msg: 'Datos incompletos'
            });
        }

        const { jerarquia, roles, permisos: permisosLista, requisicionPermisos } = permisos;

        if (
            typeof jerarquia !== 'number' ||
            !Array.isArray(roles) ||
            !Array.isArray(permisosLista)
        ) {
            return res.status(400).json({
                ok: false,
                msg: 'Estructura de permisos inválida'
            });
        }

        // Buscar usuario
        const usuario = await modelosGenerales.usuarios.findOne({
            where: { codigoempleado }
        });

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        // Guardar como JSON string
        usuario.permisos = JSON.stringify({
            jerarquia,
            roles,
            permisos: permisosLista,
            requisicionPermisos: requisicionPermisos || []
        });

        await usuario.save();

        return res.json({
            ok: true,
            msg: 'Permisos actualizados correctamente'
        });

    } catch (error) {
        console.error('Error actualizando permisos:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }
}

controller.actualizarEstadoUsuario = async (req, res) => {
    try {
        const { codigoempleado } = req.params;
        const { estado } = req.body;

        if (!codigoempleado || !['A', 'R'].includes(estado)) {
            return res.status(400).json({
                ok: false,
                msg: 'Estado inválido'
            });
        }

        const empleado = await modelosGenerales.modelonom10001.findOne({
            where: { codigoempleado }
        });

        if (!empleado) {
            return res.status(404).json({
                ok: false,
                msg: 'Empleado no encontrado'
            });
        }

        empleado.estadoempleado = estado;
        await empleado.save();

        return res.json({
            ok: true,
            msg: `Usuario ${estado === 'A' ? 'activado' : 'desactivado'} correctamente`
        });

    } catch (error) {
        console.error('Error actualizando estado del usuario:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }
}

controller.nuevoUsuario = async (req, res) => {
    try {

        const departamentos = await db.query(
            `SELECT iddepartamento, descripcion 
             FROM nom10003
             ORDER BY descripcion ASC`,
            { type: QueryTypes.SELECT }
        );

        const puestos = await db.query(
            `SELECT idpuesto, descripcion 
             FROM nom10006
             ORDER BY descripcion ASC`,
            { type: QueryTypes.SELECT }
        );

        res.render('admin/sistemas/nuevoUsuario.ejs', {
            departamentos,
            puestos
        });

    } catch (error) {
        console.error("Error cargando la vista de registro de usuario", error);
    }
}

controller.crearUsuario = async (req, res) => {
    try {

        const {
            nombre,
            apellidopaterno,
            apellidomaterno,
            nombrelargo,
            correo,
            telefono,
            departamento,
            puesto,
            esBecario
        } = req.body;

        // VALIDACIONES
        if (!nombre || !apellidopaterno || !nombrelargo || !correo || !departamento || !puesto) {
            return res.status(400).json({
                ok: false,
                msg: "Faltan campos obligatorios"
            });
        }

        // VALIDAR EMAIL DUPLICADO
        const existeCorreo = await db.query(
            `SELECT codigoempleado FROM nom10001 WHERE correoelectronico = :correo`,
            {
                replacements: { correo },
                type: QueryTypes.SELECT
            }
        );

        if (existeCorreo.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: "El correo ya está registrado"
            });
        }

        //  GENERAR IDS
        const [[{ ultimoId }]] = await db.query(
            `SELECT IFNULL(MAX(idempleado),0) AS ultimoId FROM nom10001`
        );

        const [[{ ultimoCodigo }]] = await db.query(
            `SELECT IFNULL(MAX(codigoempleado),0) AS ultimoCodigo FROM nom10001`
        );


        const nuevoIdEmpleado = ultimoId + 1;
        const nuevoCodigoEmpleado = parseInt(ultimoCodigo) + 1;
        const ultimoCodigostr = nuevoCodigoEmpleado.toString();

        const becarioValor = esBecario ? 1 : 0;

        // INSERT
        await db.query(
            `
            INSERT INTO nom10001 
            (
                idempleado,
                codigoempleado,
                nombre,
                apellidopaterno,
                apellidomaterno,
                nombrelargo,
                telefono,
                correoelectronico,
                iddepartamento,
                idpuesto,
                estadoempleado,
                esBecario
            )
            VALUES
            (
                :idempleado,
                :codigoempleado,
                :nombre,
                :apellidopaterno,
                :apellidomaterno,
                :nombrelargo,
                :telefono,
                :correo,
                :departamento,
                :puesto,
                'A',
                :esBecario
            )
            `,
            {
                replacements: {
                    idempleado: nuevoIdEmpleado,
                    codigoempleado: ultimoCodigostr,
                    nombre,
                    apellidopaterno,
                    apellidomaterno,
                    nombrelargo,
                    telefono,
                    correo,
                    departamento,
                    puesto,
                    esBecario: becarioValor
                }
            }
        );

        return res.json({
            ok: true,
            msg: "Usuario creado correctamente",
            codigoempleado: ultimoCodigostr
        });

    } catch (error) {
        console.error("Error creando usuario:", error);
        return res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

controller.eliminarUsuario = async (req, res) => {
    try {
        const { codigoempleado } = req.params;

        if (!codigoempleado) {
            return res.status(400).json({
                ok: false,
                msg: "Código de empleado requerido"
            });
        }

        const usuario = await db.query(
            `SELECT codigoempleado FROM nom10001 WHERE codigoempleado = :codigoempleado`,
            {
                replacements: { codigoempleado },
                type: QueryTypes.SELECT
            }
        );

        if (usuario.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado"
            });
        }

        await db.query(
            `DELETE FROM nom10001 WHERE codigoempleado = :codigoempleado`,
            {
                replacements: { codigoempleado }
            }
        );

        return res.json({
            ok: true,
            msg: "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.error("Error eliminando usuario:", error);
        return res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
}

//controladores de equisicion de equipos
controller.requisicionEquipos = async (req, res) => {
    try {
        let { codigoempleado } = req.usuario
        let empleado = await modelosGenerales.vistaempleados.findOne({ where: { codigoempleado: codigoempleado } })
        let clase = new sequelizeClase({ modelo: modelosGenerales.modelonom10001 })
        let criterios = { codigoempleado: codigoempleado }
        let datosEmpleado = await clase.obtener1Registro({ criterio: criterios })
        let datos = {
            nombreCompleto: datosEmpleado.nombrelargo,
            departamento: empleado.departamento,
            email: datosEmpleado.correoelectronico
        }
        return res.render('admin/sistemas/requisicionEquipos.ejs', { info: datos, tok: req.csrfToken() })
    } catch (error) {
        manejadrorErrores(res, error)
    }

}

controller.administracionRequisicionEquipos = async (req, res) => {
    try {
        const clase = new sequelizeClase({ modelo: modelosSistemas.requisicionEquipos })
        const resultados = await clase.obtenerDatosPorCriterio({ criterio: { 'status': { [Op.ne]: ['Completada'] } }, orden: [['status', 'DESC']] })
        return res.render('admin/sistemas/administracionRequisicionesEquipos.ejs', { tok: req.csrfToken(), registros: resultados })
    } catch (error) {
        manejadrorErrores(res, error)

    }
}

controller.CrudRequisicionEquipos = async (req, res) => {
    try {
        const { tipo } = req.body
        let campos = req.body
        delete campos.tipo
        let clase = new sequelizeClase({ modelo: modelosSistemas.requisicionEquipos })
        switch (tipo) {
            case 'insert':
                let resultado = await clase.insertar({ datosInsertar: campos })
                if (!resultado) return res.json({ ok: false, msg: 'no se pudo realizar la requisicion' })
                return res.json({ ok: true, msg: 'requisicion realizada exitosamente' })
            case 'delete':
                let eliminacion = await clase.eliminar({ id: campos.id })
                if (!eliminacion) return res.json({ ok: false })
                return res.json({ ok: true })
            case 'update':
                delete campos._csrf
                let actualizacion = await clase.actualizarDatos({ id: campos.id, datos: campos })
                if (campos.status === 'Completada' && actualizacion) {
                    const nod = new miNodemailer({
                        datosSmtp: {
                            host: process.env.EMAIL_HOST,
                            port: process.env.EMAIL_PORT,
                            auth: {
                                user: process.env.EMAIL_RECORDATORIO,
                                pass: process.env.PASS_RECORDATORIO
                            }

                        }
                    })
                    const info = { requesterName: campos.requesterName, id: campos.id, observaciones: campos.observaciones }
                    const miHtml = nod.htmlNotificacionNuevaReqEquipo(info)
                    await nod.enviarCorreo({ Datoscorreo: { destinatario: campos.email, asunto: 'Requisicion Equipos Completada', html: miHtml } })
                }
                if (!actualizacion) return res.json({ ok: false })
                return res.json({ ok: true })
        }
    } catch (error) {
        manejadrorErrores(res, error)

    }
}
controller.dashboardTickets = async (req, res) => {
    try {
        const clase = new sequelizeClase({ modelo: modelosSistemas.modeloTickets })
        const hoy = new Date(Date.now())
        const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        // const inicio = new Date(2026, 1, 1 )
        let final = new Date(inicio)
        final.setMonth(inicio.getMonth() + 1)
        const criterios = { createdAt: { [Op.between]: [inicio, final] } }
        const datos = await clase.obtenerDatosPorCriterio({ criterio: criterios })
        return res.render('admin/sistemas/dashboardTickets.ejs', { tok: req.csrfToken(), data: datos })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: `Error interno del servidor: ${error.message}`
        });
    }
}

controller.apiDashboard = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.body
        const clase = new sequelizeClase({ modelo: modelosSistemas.modeloTickets })
        const criterios = { createdAt: { [Op.between]: [fechaInicio, fechaFin] } }
        const datos = await clase.obtenerDatosPorCriterio({ criterio: criterios })
        return res.json({ ok: true, data: datos, tok: req.csrfToken() })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: `Error interno del servidor: ${error.message}`
        })
    }

}

controller.dashboardMonitoreo = async (req, res) => {
    try {
        res.render('admin/sistemas/monitoreo.ejs', { tok: req.csrfToken() })
    } catch (error) {
        manejadrorErrores(res, error);
    }
}

controller.ticketsMonitoreo = async (req, res) => {
    try {
        // Filtro opcional por planta/departamento. Vacío o 'todas' = sin filtro.
        const plantaFiltro = req.query.planta && req.query.planta.toLowerCase() !== 'todas'
            ? req.query.planta.trim()
            : null;

        const ticketsDB = await modelosSistemas.modeloTickets.findAll({
            order: [['createdAt', 'DESC']]
        });

        const ahora = Date.now();

        // Mapear y enriquecer cada ticket con los datos que necesita el dashboard
        const ticketsMapeados = ticketsDB.map(t => {
            const datos = parseDatosTicket(t);

            const estatus = datos.estatus || 'open';

            // Calcular horas transcurridas desde la creación
            const horasTranscurridas = Math.floor(
                (ahora - new Date(t.createdAt).getTime()) / (1000 * 60 * 60)
            );

            // Determinar si está vencido: SLA consumido + tiempo activo supera el límite
            let tiempoConsumidoHoras = Math.floor((datos.slaConsumido || 0) / 3600);
            if (datos.slaActivo && datos.slaInicio) {
                const tiempoActivoSeg = Math.floor((ahora - new Date(datos.slaInicio).getTime()) / 1000);
                tiempoConsumidoHoras += Math.floor(tiempoActivoSeg / 3600);
            }
            const slaHoras = datos.slaHoras || 72;
            const estaVencido = tiempoConsumidoHoras >= slaHoras
                && !['resolved', 'closed'].includes(estatus);

            // Mapear prioridad a etiqueta en español
            const prioridadMap = {
                low: 'Baja',
                medium: 'Media',
                high: 'Alta',
                critical: 'Crítica'
            };

            return {
                id: t.id,
                folio: t.folio,
                titulo: datos.titulo || 'Sin título',
                estatus,
                asignadoA: datos.asignadoA || null,
                prioridad: datos.prioridad || 'low',
                prioridadLabel: prioridadMap[datos.prioridad] || 'Baja',
                horasTranscurridas,
                tiempoConsumidoHoras,
                slaHoras,
                estaVencido,
                departamento: datos.departamento || '',
                nombreUsuario: datos.nombreUsuario || '',
                createdAt: t.createdAt
            };
        });

        // Aplicar filtro por planta/departamento si fue indicado
        const ticketsFiltrados = plantaFiltro
            ? ticketsMapeados.filter(t =>
                t.departamento &&
                t.departamento.toLowerCase() === plantaFiltro.toLowerCase()
            )
            : ticketsMapeados;

        // Separar por categorías para el dashboard
        const abiertos = ticketsFiltrados.filter(t =>
            t.estatus === 'open' && !t.estaVencido
        );

        const vencidos = ticketsFiltrados.filter(t =>
            t.estaVencido
        );

        const enCurso = ticketsFiltrados.filter(t =>
            (t.estatus === 'progress' || t.estatus === 'pending') && !t.estaVencido
        );

        // Estadísticas por día de la semana actual (lun–hoy)
        const hoyDate = new Date();
        const diaSemana = hoyDate.getDay(); // 0=Dom, 1=Lun ... 6=Sab
        const inicioSemana = new Date(hoyDate);
        // ajustar al lunes de la semana actual
        const diffLunes = (diaSemana === 0 ? -6 : 1 - diaSemana);
        inicioSemana.setDate(hoyDate.getDate() + diffLunes);
        inicioSemana.setHours(0, 0, 0, 0);

        const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy'];
        const atendidosPorDia = [0, 0, 0, 0, 0, 0, 0];
        const noAtendidosPorDia = [0, 0, 0, 0, 0, 0, 0];
        const vencidosPorDia = [0, 0, 0, 0, 0, 0, 0];

        ticketsFiltrados.forEach(t => {
            const fechaTicket = new Date(t.createdAt);
            fechaTicket.setHours(0, 0, 0, 0);
            const diffDias = Math.floor(
                (fechaTicket - inicioSemana) / (1000 * 60 * 60 * 24)
            );

            if (diffDias < 0 || diffDias > 6) return;

            const idx = diffDias === 6 ? 6 : diffDias;

            if (['resolved', 'closed'].includes(t.estatus)) {
                atendidosPorDia[idx]++;
            } else if (t.estaVencido) {
                vencidosPorDia[idx]++;
            } else {
                noAtendidosPorDia[idx]++;
            }
        });

        // Número de semana ISO del año
        const primerDiaAnio = new Date(hoyDate.getFullYear(), 0, 1);
        const numeroSemana = Math.ceil(
            (((hoyDate - primerDiaAnio) / 86400000) + primerDiaAnio.getDay() + 1) / 7
        );

        // Resumen semanal: tickets creados esta semana (respeta el filtro de planta)
        const ticketsSemana = ticketsFiltrados.filter(t => {
            const fechaTicket = new Date(t.createdAt);
            return fechaTicket >= inicioSemana;
        });

        const atendidosSemana = ticketsSemana.filter(t =>
            ['resolved', 'closed'].includes(t.estatus)
        ).length;

        const noAtendidosSemana = ticketsSemana.filter(t =>
            !['resolved', 'closed'].includes(t.estatus)
        ).length;

        const totalSemana = atendidosSemana + noAtendidosSemana;
        const efectividad = totalSemana > 0
            ? Math.round((atendidosSemana / totalSemana) * 100)
            : 0;

        return res.json({
            ok: true,
            semana: numeroSemana,
            totales: {
                abiertos: abiertos.length,
                vencidos: vencidos.length,
                enCurso: enCurso.length,
                activos: abiertos.length + vencidos.length + enCurso.length
            },
            tickets: {
                abiertos,
                vencidos,
                enCurso
            },
            grafica: {
                labels,
                atendidos: atendidosPorDia,
                noAtendidos: noAtendidosPorDia,
                vencidos: vencidosPorDia
            },
            resumenSemanal: {
                atendidos: atendidosSemana,
                noAtendidos: noAtendidosSemana,
                efectividad
            }
        });

    } catch (error) {
        console.error('Error en ticketsMonitoreo:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }
}

// ── SLA ───────────────────────────────────────────────────────────────────────
controller.slaMonitoreo = async (req, res) => {
    try {
        const plantaFiltro = req.query.planta && req.query.planta.toLowerCase() !== 'todas'
            ? req.query.planta.trim()
            : null;

        const ticketsDB = await modelosSistemas.modeloTickets.findAll();
        const ahora = Date.now();

        const tickets = ticketsDB.map(t => {
            const datos = parseDatosTicket(t);
            const slaHoras = datos.slaHoras || 72;

            let tiempoConsumidoSeg = datos.slaConsumido || 0;
            if (datos.slaActivo && datos.slaInicio) {
                tiempoConsumidoSeg += Math.floor(
                    (ahora - new Date(datos.slaInicio).getTime()) / 1000
                );
            }

            return {
                estatus: datos.estatus || 'open',
                prioridad: datos.prioridad || 'low',
                slaHoras,
                tiempoConsumidoSeg,
                cumplioSla: tiempoConsumidoSeg <= slaHoras * 3600,
                departamento: datos.departamento || '',
                estaVencido: tiempoConsumidoSeg >= slaHoras * 3600
                    && !['resolved', 'closed'].includes(datos.estatus || 'open')
            };
        });

        const filtrados = plantaFiltro
            ? tickets.filter(t => t.departamento.toLowerCase() === plantaFiltro.toLowerCase())
            : tickets;

        const cerrados = filtrados.filter(t => ['closed', 'resolved'].includes(t.estatus));
        const cerradosCriticos = cerrados.filter(t => ['high', 'critical'].includes(t.prioridad));

        const pctCumplidoGeneral = cerrados.length > 0
            ? Math.round(cerrados.filter(t => t.cumplioSla).length / cerrados.length * 100)
            : null;

        const pctCumplidoCriticos = cerradosCriticos.length > 0
            ? Math.round(cerradosCriticos.filter(t => t.cumplioSla).length / cerradosCriticos.length * 100)
            : null;

        const promedioResolucionHoras = cerrados.length > 0
            ? Math.round(
                cerrados.reduce((acc, t) => acc + t.tiempoConsumidoSeg, 0)
                / cerrados.length / 3600 * 10
              ) / 10
            : null;

        const ticketsVencidosActivos = filtrados.filter(t => t.estaVencido).length;

        return res.json({
            ok: true,
            pctCumplidoGeneral,
            pctCumplidoCriticos,
            promedioResolucionHoras,
            ticketsVencidosActivos
        });

    } catch (error) {
        console.error('Error en slaMonitoreo:', error);
        return res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

// ── RESOLUCIÓN SEMANAL ────────────────────────────────────────────────────────
controller.resolucionSemanal = async (req, res) => {
    try {
        const plantaFiltro = req.query.planta && req.query.planta.toLowerCase() !== 'todas'
            ? req.query.planta.trim()
            : null;

        const ticketsDB = await modelosSistemas.modeloTickets.findAll({
            attributes: ['semana', 'datosTicket'],
            where: { semana: { [Op.ne]: null } }
        });

        const tickets = ticketsDB
            .map(t => {
                const datos = parseDatosTicket(t);
                return {
                    semana: t.semana,
                    estatus: datos.estatus || 'open',
                    departamento: datos.departamento || ''
                };
            })
            .filter(t => !plantaFiltro
                || t.departamento.toLowerCase() === plantaFiltro.toLowerCase()
            );

        const semanasUnicas = [...new Set(tickets.map(t => t.semana))]
            .filter(s => s != null)
            .sort((a, b) => a - b)
            .slice(-6);

        const labels = semanasUnicas.map(s => `S${s}`);
        const tasas = semanasUnicas.map(semana => {
            const delaSemana = tickets.filter(t => t.semana === semana);
            if (delaSemana.length === 0) return null;
            const cerrados = delaSemana.filter(t =>
                ['closed', 'resolved'].includes(t.estatus)
            ).length;
            return Math.round(cerrados / delaSemana.length * 100);
        });

        return res.json({ ok: true, labels, tasas });

    } catch (error) {
        console.error('Error en resolucionSemanal:', error);
        return res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

// ── AGENTES / EQUIPO ─────────────────────────────────────────────────────────
// Lista fija de técnicos del equipo TI.
// - nombre: debe coincidir EXACTAMENTE con el valor guardado en datosTicket.asignadoA
//           (formato "Nombre Apellido" tal como lo guarda el select de asignación).
// - display: nombre que se mostrará en la UI (puede diferir del nombre de BD).
const TECNICOS_TI = [
    { nombre: 'Omar Vazquez',       display: 'Omar Vazquez',       iniciales: 'OV', rol: 'Analista TI',  avatarClass: 'av-blue'   },
    { nombre: 'Fernando de la Cruz',display: 'Fernando de la Cruz',iniciales: 'FC', rol: 'Soporte Jr',   avatarClass: 'av-purple' },
    { nombre: 'Alejandro Robledo',  display: 'Alejandro Robledo',  iniciales: 'AR', rol: 'Desarrollador',avatarClass: 'av-orange' },
    { nombre: 'Guillermo Reyes',    display: 'Memo Reyes',         iniciales: 'GR', rol: 'Desarrollador',avatarClass: 'av-green'  },
];

controller.agentesMonitoreo = async (req, res) => {
    try {
        const ticketsDB = await modelosSistemas.modeloTickets.findAll();

        // Contar tickets activos (no cerrados) por técnico.
        // La comparación es case-insensitive para tolerar diferencias de capitalización.
        const conteo = {};
        TECNICOS_TI.forEach(t => { conteo[t.nombre.toLowerCase()] = 0; });

        ticketsDB.forEach(registro => {
            const datos = parseDatosTicket(registro);
            const asignado = (datos.asignadoA || '').trim().toLowerCase();
            const estatus  = datos.estatus || 'open';

            // Solo cuenta tickets que NO están terminados
            if (['resolved', 'closed'].includes(estatus)) return;

            if (conteo.hasOwnProperty(asignado)) {
                conteo[asignado]++;
            }
        });

        const agentes = TECNICOS_TI.map(t => ({
            nombre:         t.display,          // nombre visible en la UI
            iniciales:      t.iniciales,
            rol:            t.rol,
            avatarClass:    t.avatarClass,
            ticketsActivos: conteo[t.nombre.toLowerCase()],
            estado:         conteo[t.nombre.toLowerCase()] > 0 ? 'Ocupado' : 'Activo',
        }));

        return res.json({ ok: true, agentes });

    } catch (error) {
        console.error('Error en agentesMonitoreo:', error);
        return res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

controller.requisicionesMonitoreo = async (req, res) => {
    try {
        // Filtro opcional por planta/departamento. Vacío o 'todas' = sin filtro.
        const plantaFiltro = req.query.planta && req.query.planta.toLowerCase() !== 'todas'
            ? req.query.planta.trim()
            : null;

        const whereClause = plantaFiltro
            ? { department: { [Op.like]: plantaFiltro } }
            : {};

        const requisiciones = await modelosSistemas.requisicionEquipos.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        const requisicionesFormateadas = requisiciones.map(r => {
            let items = r.items;

            if (typeof items === 'string') {
                try {
                    items = JSON.parse(items);
                } catch {
                    items = [];
                }
            }

            if (items && !Array.isArray(items)) {
                items = [items];
            }

            return {
                ...r.toJSON(),
                items
            };
        });

        // Agrupar por status: INGRESADA = abiertas, EN_PROCESO = enCurso, Completada = cerradas
        const abiertas = requisicionesFormateadas.filter(r => r.status === 'Pendiente');
        const enCurso = requisicionesFormateadas.filter(r => r.status === 'En Proceso');
        const cerradas = requisicionesFormateadas.filter(r => r.status === 'Completada');

        return res.json({
            ok: true,
            total: requisiciones.length,
            abiertas,
            enCurso,
            cerradas
        });

    } catch (error) {
        console.error('Error en requisicionesMonitoreo:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }
}

controller.inventarioMonitoreo = async (req, res) => {
    try {
        const plantaFiltro = req.query.planta && req.query.planta.toLowerCase() !== 'todas'
            ? req.query.planta.trim()
            : null;

        const inventario = await db.query(`
            SELECT 
                i.idInventario,
                i.tipo,
                i.marca,
                i.serie,
                i.folio,
                i.estado,

                n3.descripcion AS region

            FROM inventario i

            LEFT JOIN vales v 
                ON i.folio = v.idFolio

            LEFT JOIN nom10001 n1 
                ON v.numeroEmpleado = n1.codigoempleado

            LEFT JOIN nom10003 n3 
                ON n1.iddepartamento = n3.iddepartamento

            ORDER BY i.idInventario ASC;
        `, {
            type: QueryTypes.SELECT
        });

        // Filtrar por planta (igual que tickets)
        const inventarioFiltrado = plantaFiltro
            ? inventario.filter(i =>
                i.region &&
                i.region.toLowerCase() === plantaFiltro.toLowerCase()
            )
            : inventario;

        // Agrupar por tipo
        const data = {
            laptops: [],
            ensamblados: [],
            impresoras: [],
            celulares: []
        };

        inventarioFiltrado.forEach(i => {
            const tipo = (i.tipo || '').toLowerCase();

            if (tipo.includes('laptop')) data.laptops.push(i);
            else if (tipo.includes('ensamblado') || tipo.includes('allinone')) data.ensamblados.push(i);
            else if (tipo.includes('impresora')) data.impresoras.push(i);
            else if (tipo.includes('celular')) data.celulares.push(i);
        });

        return res.json({
            ok: true,
            totales: {
                laptops: data.laptops.length,
                ensamblados: data.ensamblados.length,
                impresoras: data.impresoras.length,
                celulares: data.celulares.length
            },
            inventario: data
        });

    } catch (error) {
        console.error('Error en inventarioMonitoreo:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }
};

function parseDatosTicket(ticket) {
    return typeof ticket.datosTicket === 'string'
        ? JSON.parse(ticket.datosTicket)
        : ticket.datosTicket;
}

controller.crearDepartamento = async (req, res) => {
    try {
        const { descripcion } = req.body;

        if (!descripcion?.trim()) {
            return res.status(400).json({ ok: false, msg: 'El nombre del departamento es requerido.' });
        }

        // iddepartamento y numerodepartamento no son auto-increment
        const [[{ maxId, maxNum }]] = await db.query(
            `SELECT IFNULL(MAX(iddepartamento), 0) AS maxId, IFNULL(MAX(numerodepartamento), 0) AS maxNum FROM nom10003`
        );

        const nuevoId  = maxId  + 1;
        const nuevoNum = maxNum + 1;

        await db.query(
            `INSERT INTO nom10003 (iddepartamento, numerodepartamento, descripcion) VALUES (:id, :num, :descripcion)`,
            {
                replacements: { id: nuevoId, num: nuevoNum, descripcion: descripcion.trim() },
                type: QueryTypes.INSERT
            }
        );

        return res.status(201).json({
            ok: true,
            departamento: { iddepartamento: nuevoId, descripcion: descripcion.trim() }
        });

    } catch (error) {
        console.error('Error creando departamento:', error);
        manejadrorErrores(res, error);
    }
};

controller.crearPuesto = async (req, res) => {
    try {
        const { descripcion } = req.body;

        if (!descripcion?.trim()) {
            return res.status(400).json({ ok: false, msg: 'El nombre del puesto es requerido.' });
        }

        // idpuesto y numeropuesto no son auto-increment
        const [[{ maxId, maxNum }]] = await db.query(
            `SELECT IFNULL(MAX(idpuesto), 0) AS maxId, IFNULL(MAX(numeropuesto), 0) AS maxNum FROM nom10006`
        );

        const nuevoId  = maxId  + 1;
        const nuevoNum = maxNum + 1;

        await db.query(
            `INSERT INTO nom10006 (idpuesto, numeropuesto, descripcion, timestamp) VALUES (:id, :num, :descripcion, NOW())`,
            {
                replacements: { id: nuevoId, num: nuevoNum, descripcion: descripcion.trim() },
                type: QueryTypes.INSERT
            }
        );

        return res.status(201).json({
            ok: true,
            puesto: { idpuesto: nuevoId, descripcion: descripcion.trim() }
        });

    } catch (error) {
        console.error('Error creando puesto:', error);
        manejadrorErrores(res, error);
    }
};
export default controller;

