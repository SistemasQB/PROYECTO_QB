import sequelizeClase from "../public/clases/sequelize_clase.js";
import modelosInfraestructura from "../models/infraestructura/barril_modelo_compras.js";
import modelosGenerales from "../models/generales/barrilModelosGenerales.js";
import envioOC from "../public/scripts/infraestructura/funciones/envioOrdenCompra.js";
import { Op } from "sequelize";
import db from "../config/db.js";
import manejadorErrores from "../middleware/manejadorErrores.js";
import nodemailerClase from "../public/clases/nodemailer.js";
import Requisicion from "../models/requisicion.js";
import { informacionpuesto, requisicion } from "../models/index.js";
import Informaciondepartamento from "../models/informaciondepartamento.js";
import { QueryTypes } from "sequelize";


const infraestructuraController = {}
//controlador de inicio
infraestructuraController.inicio = (req, res) => {
    try {
        return res.render('admin/infraestructura/inicio_infraestructura.ejs')
    }
    catch (ex) {
        manejadorErrores(res, ex)
    }

}

//controlador de control de inventario
infraestructuraController.controlInventario = (req, res) => {
    try {
        res.render('admin/infraestructura/control_de_inventario.ejs')
    }
    catch (ex) {
        manejadorErrores(res, ex)
    }

}
infraestructuraController.ordenCompra = async (req, res) => {
    try {
        const tok = req.csrfToken();
        const clase = new sequelizeClase({ modelo: modelosInfraestructura.modeloProveedoresOrdenesCompra })
        let criterios = { id: { [Op.gt]: 0 } }
        const proveedores = await clase.obtenerDatosPorCriterio({ criterio: criterios })
        res.render('admin/infraestructura/ordenCompra.ejs', { proveedores: proveedores, tok: tok })
    } catch (ex) {
        manejadorErrores(res, ex)
    }

};

infraestructuraController.historicoOrdenes = async (req, res) => {
    try {
        let tok = req.csrfToken()
        const clase = new sequelizeClase({ modelo: modelosInfraestructura.modeloOrdenCompra })
        const criterios = { status: { [Op.ne]: 'ENVIADA' } }
        let ordenes = await clase.obtenerDatosPorCriterio({ criterio: criterios })
        res.render('admin/infraestructura/historico_ordenes_compra.ejs', { ordenes: ordenes, tok: tok })
    } catch (ex) {
        manejadorErrores(res, ex)
    }
}
infraestructuraController.crudOrdenesCompra = async (req, res) => {
    try {
        const { tipo } = req.body
        if (!tipo) return res.json({ ok: false, msg: 'no se especifico el tipo de accion' })
        const clase = new sequelizeClase({ modelo: modelosInfraestructura.modeloOrdenCompra })
        let { id } = req.body || 0;
        let servicios
        let partidas
        switch (tipo) {
            case 'insert':
                let campitos = req.body
                delete campitos._csrf
                delete campitos.tipo
                servicios = JSON.parse(campitos.servicios)
                partidas = JSON.parse(servicios.partidas)
                servicios.partidas = partidas
                campitos.servicios = servicios
                campitos.informacionProveedor = JSON.parse(campitos.informacionProveedor)
                let respuesta = await clase.insertar({ datosInsertar: campitos })
                if (respuesta) return res.json({ ok: respuesta, msg: 'informacion almacenada con exito' })
                return res.json({ ok: false, msg: 'no se pudo guardar la informacion en la base de datos' })
            case 'update':
                let datos = req.body
                delete datos._csrf
                delete datos.tipo
                delete datos.id
                delete datos._csrf
                servicios = JSON.parse(datos.servicios)
                partidas = servicios.partidas
                servicios.partidas = partidas
                datos.servicios = servicios
                return res.json({ ok: await clase.actualizarDatos({ id: id, datos: datos, msg: '' }) })
            case 'delete':
                let resultado = await clase.eliminar({ id: id })
                return res.json({ ok: resultado, msg: 'exito en el proceso' })
            case 'send':
                let campos = req.body
                delete campos._csrf
                delete campos.tipo
                let orden = await clase.obtener1Registro({ criterio: { id: id } })
                if (orden.estatus == 'ENVIADA') return res.json({ ok: true, msg: 'la OC ya habia sido enviada' })
                delete campos.id
                ///parseo de la informacion
                orden.informacionProveedor = JSON.parse(orden.informacionProveedor)
                orden.servicios = campos.servicios
                orden.observaciones = campos.observaciones

                //configuracion que se debe de eliminar
                const configuracion = new nodemailerClase({ datosSmtp: { host: process.env.EMAIL_HOST, port: process.env.EMAIL_PORT, auth: { user: process.env.EMAILR_USER, pass: process.env.EMAILR_PASS, } } })
                let confirmacion = await configuracion.enviarCorreo({
                    Datoscorreo: {
                        destinatario: orden.informacionProveedor.correo, asunto: `ORDEN DE COMPRA DE QUALITY BOLCA`,
                        texto: 'orden compra', html: configuracion.htmlOrdenesCompra({ datos: orden }), cc: "grupo.compras@qualitybolca.com"
                    }
                })

                if (!confirmacion) return res.json({ ok: confirmacion, msg: 'no se pudo notificar al proveedor' })
                let envio = await clase.actualizarDatos({ id: id, datos: campos })
                if (!envio) return res.json({ ok: envio, msg: 'no se pudo actualizar la OC' })
                //let envioO = envioOC({datos: orden})
                // if (!envioO) return res.json({ok:envioO, msg:'no se pudo enviar la OC'})
                return res.json({ ok: true, msg: 'OC enviada exitosamente' })
        }
    } catch (ex) {
        console.log(ex)
        return res.json({ ok: false, msg: ex, error: ex.message })

    }

}

//controladores de pedidos de insumos
infraestructuraController.pedidoInsumos = async (req, res) => {
    try {
        let tok = req.csrfToken()
        let clase = new sequelizeClase({ modelo: modelosInfraestructura.modeloComprasInventario })
        let criterios = { estatus: { [Op.ne]: 'NO ACTIVO' } }
        let productos = await clase.obtenerDatosPorCriterio({ criterio: criterios })
        clase = new sequelizeClase({ modelo: modelosInfraestructura.modelo_plantas_gastos })
        criterios = { id: { [Op.gt]: 0 } }
        let plantas = await clase.obtenerDatosPorCriterio({ criterio: criterios })
        return res.render('admin/infraestructura/formato_pedido_insumos.ejs', {
            productos: productos,
            plantas: plantas,
            tok: tok
        })
    } catch (ex) {
        manejadorErrores(res, ex)
    }
}
infraestructuraController.crudPedidoInsumos = async (req, res) => {
    try {
        let campos = req.body
        delete campos._csrf
        let usuario = req.usuario.codigoempleado
        let clase = new sequelizeClase({ modelo: modelosGenerales.modelonom10001 })
        let datosUsuario = await clase.obtener1Registro({ criterio: { codigoempleado: usuario } })
        clase = new sequelizeClase({ modelo: modelosInfraestructura.modelo_pedido_insumos })
        const envio = new nodemailerClase({ datosSmtp: { host: process.env.EMAIL_HOST, port: process.env.EMAIL_PORT, auth: { user: process.env.EMAILR_USER, pass: process.env.EMAILR_PASS, } } })
        let confirmacion = false
        const id = campos.id
        switch (campos.tipo) {
            case 'insert':
                delete campos.tipo
                campos.solicitante = datosUsuario.nombrelargo
                let respuesta = await clase.insertar({ datosInsertar: campos })
                if (!respuesta) return res.json({ ok: false, msg: 'no se pudo ingresar la informacion' })
                confirmacion = await envio.enviarCorreo({ Datoscorreo: { destinatario: 'grupo.compras@qualitybolca.com', asunto: `nuevo pedido de insumos de (${campos.solicitante})`, texto: 'pedido de insumos', html: envio.htmlPedidoInsumos() } })
                if (!confirmacion) return res.json({ ok: true, msg: 'la requisicion se hizo, pero no se pudo notificar al area de compras' })
                return res.json({ ok: respuesta, msg: 'informacion enviada exitosamente' })
            case 'update':
                delete campos.id
                delete campos.tipo
                const solicitante = campos.solicitante
                delete campos.solicitante
                let actualizado = await clase.actualizarDatos({ id: id, datos: campos })
                if (!actualizado) return res.json({ ok: false, msg: 'no se pudo actualizar la informacion' })
                clase = new sequelizeClase({ modelo: modelosGenerales.modelonom10001 })
                let datosSolicitante = await clase.obtener1Registro({ criterio: { nombrelargo: solicitante } })
                if (!datosSolicitante) return res.json({ ok: true, msg: 'informacion actualizada exitosamente' })
                datosSolicitante.id = id
                console.log(datosSolicitante)
                actualizado = envio.enviarCorreo({ Datoscorreo: { destinatario: datosSolicitante.correoelectronico, asunto: `pedido de insumos Surtido`, texto: 'pedido surtido', html: envio.htmlConfirmacionSurtimiento(datosSolicitante) } })
                return res.json({ ok: actualizado, msg: 'informacion actualizada exitosamente' })
            case 'delete':
                let eliminado = await clase.eliminar({ id: id })
                if (!eliminado) return res.json({ ok: false, msg: 'no se pudo eliminar la informacion' })
                return res.json({ ok: eliminado, msg: 'informacion eliminada exitosamente' })
            case 'rechazo':
                delete campos.tipo
                delete campos.id
                let rechazado = await clase.actualizarDatos({ id: id, datos: campos })
                if (!rechazado) return res.json({ ok: false, msg: 'no se pudo rechazar la informacion' })
                return res.json({ ok: rechazado, msg: 'informacion actualizada exitosamente' })
        }
    } catch (error) {
        console.log(error)
        manejadorErrores(res, error)
    }

}

infraestructuraController.gestionPedidosInsumos = async (req, res) => {
    try {
        let clase = new sequelizeClase({ modelo: modelosInfraestructura.modelo_pedido_insumos })
        let resultados = await clase.obtenerDatosPorCriterio({ criterio: { estatus: 'PENDIENTE' } })
        clase = new sequelizeClase({ modelo: modelosInfraestructura.modeloComprasInventario })
        let criterios = { estatus: { [Op.ne]: 'NO ACTIVO' } }
        let productos = await clase.obtenerDatosPorCriterio({ criterio: criterios })
        let usuario = req.usuario.codigoempleado
        clase = new sequelizeClase({ modelo: modelosGenerales.modelonom10001 })
        let datosUsuario = await clase.obtener1Registro({ criterio: { codigoempleado: usuario } })
        return res.render('admin/infraestructura/gestionPedidosInsumos.ejs', { pendientes: resultados, productos: productos, usuario: datosUsuario.nombrelargo, tok: req.csrfToken() })
    } catch (error) {
        manejadorErrores(res, ex)
    }

}


//controladores de logistica vehicular

// controladores de check list vehicular
infraestructuraController.checklistVehicular = async (req, res) => {
    try {
        const tok = req.csrfToken()
        const clase = new sequelizeClase({ modelo: modelosInfraestructura.modeloUnidadesLogistica })
        const criterios = { estatus: 'ACTIVO' }
        const orden = [['vehiculo', 'ASC']]
        let unidades = await clase.obtenerDatosPorCriterio({ criterio: criterios, ordenamiento: orden })
        return res.render('admin/infraestructura/check_list_vehicular.ejs', { unidades: unidades, tok: tok })
    } catch (ex) {
        manejadorErrores(res, ex)
    }


}

infraestructuraController.crudCheckListVehicular = async (req, res) => {
    try {
        let clase = new sequelizeClase({ modelo: modelosInfraestructura.modeloCheckListVehicular })
        let { tipo } = req.body
        switch (tipo) {
            case 'insert':
                let archivos = req.files
                let datos = req.body
                delete datos.tipo
                delete datos._csrf
                Object.entries(datos).forEach(([key, value]) => {
                    try {
                        let parseo = JSON.parse(value)
                        if (typeof parseo === 'object') { datos[key] = parseo }
                    } catch (error) { }
                });

                if (archivos.length > 0) {
                    datos.evidencias = []
                    archivos.map((file) => {
                        datos.evidencias.push(file.filename)
                    })
                }

                let mi = await clase.insertar({ datosInsertar: datos })
                return res.json({ ok: mi, msg: 'informacion guarda con exito' })
            case 'delete':
                let idE = req.body.id
                return res.json({ ok: await clase.eliminar({ id: idE }), msg: 'informacion eliminada con exito' })
            case 'update':
                let { id } = req.body
                let camp = req.body
                delete camp._csrf
                delete camp.tipo
                delete camp.id
                Object.entries(camp).forEach(([c, value]) => {
                    try {
                        let par = JSON.parse(value)
                        if (typeof par === 'object') {
                            camp[c] = par
                        }
                    } catch (error) {

                    }
                }
                )
                return res.json({ ok: await clase.actualizarDatos({ id: id, datos: camp }) })
        }
    } catch (ex) {
        manejadorErrores(res, ex)
    }

}

infraestructuraController.vistaCheckListVehicular = async (req, res) => {
    try {
        let { id } = req.params
        let clase = new sequelizeClase({ modelo: modelosInfraestructura.modeloCheckListVehicular })
        let criterios = { id: parseInt(id) }
        let resultado = await clase.obtener1Registro({ criterio: criterios })
        res.render('admin/infraestructura/logistica_vehicular/formato_check_list_vehicular.ejs', { resultados: resultado })
    } catch (error) {
        manejadorErrores(res, ex)
    }
}

infraestructuraController.historicoCheckListVehicular = async (req, res) => {
    try {
        const tok = req.csrfToken()
        let clase = new sequelizeClase({ modelo: modelosInfraestructura.modeloCheckListVehicular })
        let criterios = { estatus: { [Op.ne]: '' } };
        let atributos = ['id', 'datosUnidad', 'createdAt', 'estatus']
        let lista = await clase.obtenerDatosPorCriterio({ criterio: criterios, atributos: atributos })
        return res.render('admin/infraestructura/logistica_vehicular/historico_check_list_vehicular.ejs', {
            checks: lista,
            tok: tok
        })
    } catch (ex) {
        manejadorErrores(res, ex)
    }
}

infraestructuraController.requisicionGastos = async (req, res) => {
    try {
        //obtener datos de usuario loggeado
        let usuario = req.usuario.codigoempleado
        let clase = new sequelizeClase({
            modelo: modelosGenerales.modelonom10001
        })
        let datosUsuario = await clase.obtener1Registro({
            criterio: { codigoempleado: usuario }
        })

        // obtener puesto
        let clasePuesto = new sequelizeClase({
            modelo: informacionpuesto
        })

        let puesto = await clasePuesto.obtener1Registro({
            criterio: { idpuesto: datosUsuario.idpuesto }
        })

        // obtener departamento
        let claseDepartamento = new sequelizeClase({
            modelo: Informaciondepartamento
        })

        let departamento = await claseDepartamento.obtener1Registro({
            criterio: { iddepartamento: datosUsuario.iddepartamento }
        })

        datosUsuario.puesto = puesto ? puesto.descripcion : ''
        datosUsuario.departamento = departamento ? departamento.descripcion : ''
        const nombreUsuario = datosUsuario.nombrelargo

        //contadores dashboard
        const [dashboard] = await db.query(`
            SELECT
                SUM(CASE 
                    WHEN estatus = 'INGRESADA' 
                    THEN 1 ELSE 0 
                END) AS pendientesConfirmacion,

                SUM(CASE 
                    WHEN estatus = 'APROBADA' 
                    THEN 1 ELSE 0 
                END) AS porComprobar,

                SUM(CASE
                    WHEN fechaEntrega >= DATE_FORMAT(NOW(), '%Y-%m-01')
                    THEN total
                    ELSE 0
                END) AS montoTotalMes

            FROM requisiciones
            WHERE solicitante = :nombreUsuario
        `, {
            replacements: { nombreUsuario },
            type: db.QueryTypes.SELECT
        })

        const nombreAutorizador = nombreUsuario

        const usuarioReq = await db.query(`
                    SELECT departamento
                    FROM usuariosRequisiciones
                    WHERE nombre = :nombre
                    LIMIT 1
                `, {
            replacements: { nombre: nombreAutorizador },
            type: QueryTypes.SELECT
        })

        if (!usuarioReq.length) {
            return res.render('admin/infraestructura/requisicionGastos.ejs', {
                usuario: datosUsuario,
                requisiciones,
                pendientesConfirmacion: 0,
                porComprobar: 0,
                montoTotalMes: 0,
                stats: { total_pendientes: 0, monto_total: 0 },
                tok: req.csrfToken()
            })
        }

        const { departamento: departamentoReq } = usuarioReq[0]

        const usuarioJer = await db.query(`
            SELECT jerarquia
            FROM usuariosRequisiciones
            WHERE nombre = :nombre
            LIMIT 1
        `, {
            replacements: { nombre: nombreUsuario },
            type: QueryTypes.SELECT
        })

        const jerarquia = usuarioJer[0]?.jerarquia || 5

        const statsResult = await db.query(`
                SELECT 
                    COUNT(*) as total_pendientes,
                    COALESCE(SUM(total), 0) as monto_total
                FROM requisiciones
                WHERE estatus = 'INGRESADA'
                AND autoriza = :departamento
        `, {
            replacements: {
                departamento: departamentoReq
            },
            type: QueryTypes.SELECT
        })

        const requisiciones = await db.query(`
            SELECT 
                id,
                horaRegistro,
                asunto,
                total,
                estatus
            FROM requisiciones
            WHERE solicitante = :nombreUsuario
            ORDER BY horaRegistro DESC
            LIMIT 10
        `, {
            replacements: { nombreUsuario },
            type: db.QueryTypes.SELECT
        })

        console.log(requisiciones)

        const pendientesConfirmacion = dashboard.pendientesConfirmacion || 0
        const porComprobar = dashboard.porComprobar || 0
        const montoTotalMes = dashboard.montoTotalMes || 0



        return res.render('admin/infraestructura/requisicionGastos.ejs', {
            usuario: datosUsuario,
            requisiciones,
            //comprobaciones: comprobaciones,
            pendientesConfirmacion: pendientesConfirmacion,
            porComprobar: porComprobar,
            montoTotalMes: montoTotalMes,
            stats: statsResult[0],
            jerarquia,
            tok: req.csrfToken()
        })

    } catch (error) {
        manejadorErrores(res, error)
    }
}

infraestructuraController.crudRequisicionGastos = async (req, res) => {
    try {

        let campos = req.body
        delete campos._csrf
        let usuario = req.usuario.codigoempleado
        let clase = new sequelizeClase({ modelo: Requisicion })

        const id = campos.id

        switch (campos.tipo) {

            case 'insert':

            case 'misRequisiciones': //mis requisiciones

                let misRequisiciones = await clase.obtenerDatosPorCriterio({
                    criterio: {
                        solicitante: usuario
                    }
                })

                return res.json({
                    ok: true,
                    datos: misRequisiciones
                })


            case 'autorizar':

                let pendientesAutorizar = await clase.obtenerDatosPorCriterio({
                    criterio: {
                        autorizador: usuario,
                        estatus: 'PENDIENTE'
                    }
                })

                return res.json({
                    ok: true,
                    datos: pendientesAutorizar
                })

            case 'porComprobar':

            case 'tablaRequisiciones':
                const datosUsuario = await db.query(`
                    SELECT nombrelargo
                    FROM nom10001
                    WHERE codigoempleado = :usuario
                `, {
                    replacements: { usuario },
                    type: db.QueryTypes.SELECT
                })

                const nombreUsuario = datosUsuario[0].nombrelargo

                const requisiciones = await db.query(`
                    SELECT 
                        id,
                        horaRegistro,
                        asunto,
                        total,
                        estatus
                    FROM requisiciones
                    WHERE solicitante = :nombreUsuario
                    ORDER BY horaRegistro DESC
                    LIMIT 10
                `, {
                    replacements: { nombreUsuario },
                    type: db.QueryTypes.SELECT
                })

                return res.json({
                    ok: true,
                    datos: requisiciones
                })

            case 'detalleRequisicion':
                const requisicion = await db.query(`
                    SELECT *
                    FROM requisiciones
                    WHERE id = :id
            `, {
                    replacements: { id },
                    type: db.QueryTypes.SELECT
                })

                return res.json({
                    ok: true,
                    requisicion: requisicion[0]
                })

            case 'update':

            case 'resolverRequisicion':
                const justificacion = campos.justificacion || null

                if (campos.estatus === 'RECHAZADA' && !justificacion) {
                    return res.json({
                        ok: false,
                        msg: 'Debe ingresar una justificación'
                    })
                }

                const datosUsuarioAuth = await db.query(`
                    SELECT nombrelargo
                    FROM nom10001
                    WHERE codigoempleado = :usuario
                `, {
                    replacements: { usuario },
                    type: QueryTypes.SELECT
                })

                const nombreAutorizador = datosUsuarioAuth[0].nombrelargo

                const [reqDB] = await db.query(`
                    SELECT *
                    FROM requisiciones
                    WHERE id = :id
                `, {
                    replacements: { id },
                    type: QueryTypes.SELECT
                })

                if (!reqDB) {
                    return res.json({ ok: false, msg: 'Requisición no encontrada' })
                }

                const usuarioSolicitante = await db.query(`
                    SELECT correo
                    FROM usuariosRequisiciones
                    WHERE nombre = :nombre
                    LIMIT 1
                `, {
                    replacements: { nombre: reqDB.solicitante },
                    type: QueryTypes.SELECT
                })

                const correoSolicitante = usuarioSolicitante[0]?.correo || null

                if (!correoSolicitante) {
                    console.warn(`Usuario sin correo: ${reqDB.solicitante}`)
                }

                const usuarioReq = await db.query(`
                    SELECT departamento
                    FROM usuariosRequisiciones
                    WHERE nombre = :nombre
                    LIMIT 1
                `, {
                    replacements: { nombre: nombreAutorizador },
                    type: QueryTypes.SELECT
                })

                if (!usuarioReq.length || usuarioReq[0].departamento !== reqDB.autoriza) {
                    return res.json({
                        ok: false,
                        msg: 'No tienes permisos para aprobar esta requisición'
                    })
                }

                // ACTUALIZAR ESTATUS
                await db.query(`
                UPDATE requisiciones
                SET estatus = :estatus,
                    autorizo = :autorizo
                WHERE id = :id
            `, {
                    replacements: {
                        estatus: campos.estatus,
                        autorizo: nombreAutorizador,
                        justificacion,
                        id
                    },
                    type: QueryTypes.UPDATE
                })

                // ENVIAR CORREO SOLO SI SE APRUEBA
                if (campos.estatus === 'APROBADA') {

                    const correo = new nodemailerClase({
                        datosSmtp: {
                            host: process.env.EMAIL_HOST,
                            port: process.env.EMAIL_PORT,
                            auth: {
                                user: process.env.EMAILR_USER,
                                pass: process.env.EMAILR_PASS
                            }
                        }
                    })

                    const html = correo.htmlRequisicionAprobada({
                        datos: reqDB,
                        autorizador: nombreAutorizador
                    })

                    const correoCompras = 'info.sistemas@qualitybolca.com'

                    const destinatarios = [correoCompras]

                    if (correoSolicitante) {
                        destinatarios.push(correoSolicitante)
                    }

                    await correo.enviarCorreo({
                        Datoscorreo: {
                            destinatario: correoCompras,
                            cc: correoSolicitante || undefined,
                            asunto: `Requisición APROBADA (${reqDB.id})`,
                            texto: 'Requisición aprobada',
                            html
                        }
                    })
                }

                if (campos.estatus === 'RECHAZADA') {

                    const correo = new nodemailerClase({
                        datosSmtp: {
                            host: process.env.EMAIL_HOST,
                            port: process.env.EMAIL_PORT,
                            auth: {
                                user: process.env.EMAILR_USER,
                                pass: process.env.EMAILR_PASS
                            }
                        }
                    })

                    if (!correoSolicitante) {
                        console.warn('No se encontró correo del solicitante')
                    }

                    const html = `
                        <p>Buen día <b>${reqDB.solicitante}</b>,</p>

                        <p>Tu requisición ha sido <b>RECHAZADA</b> por <b>${nombreAutorizador}</b>.</p>

                        <p><b>Motivo del rechazo:</b></p>
                        <p style="background:#f3f4f6; padding:10px; border-radius:5px;">
                            ${justificacion}
                        </p>

                        <br>
                        <p>EXPENSE SUPPORT SYSTEM</p>
                        <p><b>No responda a este mensaje.</b></p>
                    `
                    if (correoSolicitante) {
                        await correo.enviarCorreo({
                            Datoscorreo: {
                                destinatario: correoSolicitante,
                                asunto: `Requisición RECHAZADA (${reqDB.id})`,
                                texto: 'Requisición rechazada',
                                html
                            }
                        })
                    }
                }

                return res.json({
                    ok: true,
                    msg: `Requisición ${campos.estatus}`
                })
        }

    } catch (error) {
        console.log(error)
        manejadorErrores(res, error)
    }
}

infraestructuraController.crearRequisicionGastos = async (req, res) => {
    res.render('admin/infraestructura/requisicionGastos_form.ejs', { tok: req.csrfToken() })
}

infraestructuraController.aprobacionesRequisicionGastos = async (req, res) => {
    try {
        //obtener datos de usuario loggeado
        let usuario = req.usuario.codigoempleado
        let clase = new sequelizeClase({
            modelo: modelosGenerales.modelonom10001
        })
        let datosUsuario = await clase.obtener1Registro({
            criterio: { codigoempleado: usuario }
        })

        // obtener puesto
        let clasePuesto = new sequelizeClase({
            modelo: informacionpuesto
        })

        let puesto = await clasePuesto.obtener1Registro({
            criterio: { idpuesto: datosUsuario.idpuesto }
        })

        // obtener departamento
        let claseDepartamento = new sequelizeClase({
            modelo: Informaciondepartamento
        })

        let departamentoUsuario = await claseDepartamento.obtener1Registro({
            criterio: { iddepartamento: datosUsuario.iddepartamento }
        })

        datosUsuario.puesto = puesto ? puesto.descripcion : ''
        datosUsuario.departamento = departamentoUsuario ? departamentoUsuario.descripcion : ''

        const usuarioReq = await db.query(`
                SELECT nombre, jerarquia, departamento
                FROM usuariosRequisiciones
                WHERE nombre = :nombre
                LIMIT 1
        `, {
            replacements: {
                nombre: datosUsuario.nombrelargo
            },
            type: QueryTypes.SELECT
        })

        if (!usuarioReq.length) {
            return res.render('admin/infraestructura/aprobacionesRequisicionGastos.ejs', {
                usuario: datosUsuario,
                tok: req.csrfToken(),
                stats: { total_pendientes: 0, monto_total: 0 },
                requisiciones: []
            })
        }

        const { jerarquia, departamento: departamentoReq } = usuarioReq[0]


        if (jerarquia > 4) {
            return res.render('admin/infraestructura/aprobacionesRequisicionGastos.ejs', {
                usuario: datosUsuario,
                tok: req.csrfToken(),
                stats: { total_pendientes: 0, monto_total: 0 },
                requisiciones: []
            })
        }

        const statsResult = await db.query(`
                SELECT 
                    COUNT(*) as total_pendientes,
                    COALESCE(SUM(total), 0) as monto_total
                FROM requisiciones
                WHERE estatus = 'INGRESADA'
                AND autoriza = :departamento
        `, {
            replacements: {
                departamento: departamentoReq
            },
            type: QueryTypes.SELECT
        })

        const requisiciones = await db.query(`
                SELECT *
                FROM requisiciones
                WHERE estatus = 'INGRESADA'
                AND autoriza = :departamento
                ORDER BY horaRegistro DESC
        `, {
            replacements: { departamento: departamentoReq },
            type: QueryTypes.SELECT
        })


        res.render('admin/infraestructura/aprobacionesRequisicionGastos.ejs', {
            usuario: datosUsuario,
            tok: req.csrfToken(),
            stats: statsResult[0],
            requisiciones
        })

    } catch (error) {
        manejadorErrores(res, error)
    }
}

infraestructuraController.misRequisicionesGastos = async (req, res) => {
    res.render('admin/infraestructura/misRequisicionesGastos.ejs', { tok: req.csrfToken() })
}
infraestructuraController.comprobarRequisicionesGastos = async (req, res) => {
    res.render('admin/infraestructura/comprobarRequisicionesGastos.ejs', { tok: req.csrfToken() })
}
export default infraestructuraController;