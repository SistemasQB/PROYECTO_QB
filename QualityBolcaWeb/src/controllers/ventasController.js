import manejadorErrores from "../middleware/manejadorErrores.js";
import { Op, fn, col } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import Cliente              from '../models/ventas/modeloCliente.js';
import ProspectoVentas      from '../models/ventas/modeloProspectoVentas.js';
import ProspectoVentasSemana from '../models/ventas/modeloProspectoVentasSemana.js';
import SeguimientoCliente   from '../models/ventas/modeloSeguimientoCliente.js';
import ActividadSeguimiento from '../models/ventas/modeloActividadSeguimiento.js';
import EventoCalendario     from '../models/ventas/modeloEventoCalendario.js';

ProspectoVentas.hasMany(ProspectoVentasSemana,  { foreignKey: 'prospectoId',   as: 'semanaRecs' });
ProspectoVentasSemana.belongsTo(ProspectoVentas, { foreignKey: 'prospectoId' });
SeguimientoCliente.hasMany(ActividadSeguimiento, { foreignKey: 'seguimientoId', as: 'actividades' });
ActividadSeguimiento.belongsTo(SeguimientoCliente, { foreignKey: 'seguimientoId' });
EventoCalendario.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

const genId = () => uuidv4().replace(/-/g, '').substring(0, 30);

const ventasController = {};

/* ── VISTAS ── */
ventasController.dashboard    = (req, res) => res.render('admin/ventas/dashboard.ejs', { token: req.csrfToken() });
ventasController.clientes     = (req, res) => res.render('admin/ventas/clientes.ejs',     { token: req.csrfToken() });
ventasController.agendaVentas = (req, res) => res.render('admin/ventas/agendaVentas.ejs', { token: req.csrfToken() });
ventasController.seguimiento  = (req, res) => res.render('admin/ventas/seguimiento.ejs',  { token: req.csrfToken() });
ventasController.calendario   = (req, res) => res.render('admin/ventas/calendario.ejs',   { token: req.csrfToken() });

/* ─────────────────────────────────────────
   CLIENTES
───────────────────────────────────────── */
ventasController.getClientes = async (req, res) => {
    try {
        const data = await Cliente.findAll({ order: [['fechaAlta', 'DESC']] });
        return res.json({ ok: true, token: req.csrfToken(), data });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al obtener clientes' });
    }
};

ventasController.createCliente = async (req, res) => {
    try {
        const { rfc, denominacion, razonSocial, estado, giro, moneda,
                contactoCalidad, telefonoCalidad, correoCalidad,
                contactoCompras, telefonoCompras, correoCompras } = req.body;

        if (!denominacion || !razonSocial) {
            return res.status(400).json({ ok: false, token: req.csrfToken(), msg: 'Denominación y razón social son requeridas' });
        }
        const count = await Cliente.count();
        const folio = `CLI-${String(count + 1).padStart(3, '0')}`;
        const nuevo = await Cliente.create({
            id: genId(), folio, rfc, denominacion, razonSocial, estado, giro,
            moneda: moneda || 'MXN', contactoCalidad, telefonoCalidad, correoCalidad,
            contactoCompras, telefonoCompras, correoCompras,
        });
        return res.json({ ok: true, token: req.csrfToken(), data: nuevo, msg: 'Cliente creado correctamente' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al crear cliente' });
    }
};

ventasController.updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { rfc, denominacion, razonSocial, estado, giro, moneda,
                contactoCalidad, telefonoCalidad, correoCalidad,
                contactoCompras, telefonoCompras, correoCompras } = req.body;

        if (!denominacion || !razonSocial) {
            return res.status(400).json({ ok: false, token: req.csrfToken(), msg: 'Denominación y razón social son requeridas' });
        }
        const [updated] = await Cliente.update(
            { rfc, denominacion, razonSocial, estado, giro, moneda: moneda || 'MXN',
              contactoCalidad, telefonoCalidad, correoCalidad,
              contactoCompras, telefonoCompras, correoCompras },
            { where: { id } }
        );
        if (!updated) return res.status(404).json({ ok: false, token: req.csrfToken(), msg: 'Cliente no encontrado' });
        return res.json({ ok: true, token: req.csrfToken(), msg: 'Cliente actualizado correctamente' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al actualizar cliente' });
    }
};

ventasController.deleteCliente = async (req, res) => {
    try {
        const deleted = await Cliente.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ ok: false, token: req.csrfToken(), msg: 'Cliente no encontrado' });
        return res.json({ ok: true, token: req.csrfToken(), msg: 'Cliente eliminado correctamente' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al eliminar cliente' });
    }
};

/* ─────────────────────────────────────────
   PROSPECTOS
───────────────────────────────────────── */
ventasController.getProspectos = async (req, res) => {
    try {
        const items = await ProspectoVentas.findAll({
            include: [{ model: ProspectoVentasSemana, as: 'semanaRecs', attributes: ['semana'] }],
            order: [['createdAt', 'DESC']],
        });
        const data = items.map(p => {
            const obj = p.toJSON();
            obj.semanas = (obj.semanaRecs || []).map(s => s.semana).sort((a, b) => a - b);
            delete obj.semanaRecs;
            return obj;
        });
        return res.json({ ok: true, token: req.csrfToken(), data });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al obtener prospectos' });
    }
};

ventasController.createProspecto = async (req, res) => {
    try {
        const { razonSocial, direccion, parqueIndustrial, giro, nombreContacto,
                correo, telefono, etapa, motivoRechazo, comentarios, semanas } = req.body;

        if (!razonSocial) return res.status(400).json({ ok: false, token: req.csrfToken(), msg: 'Razón social requerida' });

        const id = genId();
        const prospecto = await ProspectoVentas.create({
            id, razonSocial, direccion, parqueIndustrial, giro, nombreContacto,
            correo, telefono, etapa: etapa || 'Prospecto',
            motivoRechazo: motivoRechazo || null, comentarios,
        });
        if (Array.isArray(semanas) && semanas.length > 0) {
            await ProspectoVentasSemana.bulkCreate(
                semanas.map(s => ({ prospectoId: id, semana: s })),
                { ignoreDuplicates: true }
            );
        }
        return res.json({ ok: true, token: req.csrfToken(), data: { ...prospecto.toJSON(), semanas: semanas || [] }, msg: 'Prospecto creado correctamente' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al crear prospecto' });
    }
};

ventasController.updateProspecto = async (req, res) => {
    try {
        const { id } = req.params;
        const { razonSocial, direccion, parqueIndustrial, giro, nombreContacto,
                correo, telefono, etapa, motivoRechazo, comentarios, semanas } = req.body;

        if (!razonSocial) return res.status(400).json({ ok: false, token: req.csrfToken(), msg: 'Razón social requerida' });

        const [updated] = await ProspectoVentas.update(
            { razonSocial, direccion, parqueIndustrial, giro, nombreContacto,
              correo, telefono, etapa, motivoRechazo: motivoRechazo || null, comentarios },
            { where: { id } }
        );
        if (!updated) return res.status(404).json({ ok: false, token: req.csrfToken(), msg: 'Prospecto no encontrado' });

        await ProspectoVentasSemana.destroy({ where: { prospectoId: id } });
        if (Array.isArray(semanas) && semanas.length > 0) {
            await ProspectoVentasSemana.bulkCreate(
                semanas.map(s => ({ prospectoId: id, semana: s })),
                { ignoreDuplicates: true }
            );
        }
        return res.json({ ok: true, token: req.csrfToken(), msg: 'Prospecto actualizado correctamente' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al actualizar prospecto' });
    }
};

ventasController.deleteProspecto = async (req, res) => {
    try {
        const deleted = await ProspectoVentas.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ ok: false, token: req.csrfToken(), msg: 'Prospecto no encontrado' });
        return res.json({ ok: true, token: req.csrfToken(), msg: 'Prospecto eliminado' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al eliminar prospecto' });
    }
};

/* ─────────────────────────────────────────
   SEGUIMIENTOS
───────────────────────────────────────── */
ventasController.getSeguimientos = async (req, res) => {
    try {
        const data = await SeguimientoCliente.findAll({
            include: [{ model: ActividadSeguimiento, as: 'actividades', required: false }],
            order: [
                ['updatedAt', 'DESC'],
                [{ model: ActividadSeguimiento, as: 'actividades' }, 'fecha', 'DESC'],
            ],
        });
        return res.json({ ok: true, token: req.csrfToken(), data });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al obtener seguimientos' });
    }
};

ventasController.createSeguimiento = async (req, res) => {
    try {
        const { clienteId, activo, estatus, region, estado, municipio,
                parqueIndustrial, nombreContacto, celular, correo } = req.body;
        if (!clienteId) return res.status(400).json({ ok: false, token: req.csrfToken(), msg: 'Cliente requerido' });

        const seg = await SeguimientoCliente.create({
            id: genId(), clienteId, activo: activo !== false,
            estatus, region, estado, municipio, parqueIndustrial, nombreContacto, celular, correo,
        });
        return res.json({ ok: true, token: req.csrfToken(), data: seg, msg: 'Seguimiento creado' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al crear seguimiento' });
    }
};

ventasController.updateSeguimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const { activo, estatus, region, estado, municipio, parqueIndustrial, nombreContacto, celular, correo } = req.body;
        const [updated] = await SeguimientoCliente.update(
            { activo: !!activo, estatus, region, estado, municipio, parqueIndustrial, nombreContacto, celular, correo },
            { where: { id } }
        );
        if (!updated) return res.status(404).json({ ok: false, token: req.csrfToken(), msg: 'Seguimiento no encontrado' });
        return res.json({ ok: true, token: req.csrfToken(), msg: 'Seguimiento actualizado' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al actualizar seguimiento' });
    }
};

ventasController.deleteSeguimiento = async (req, res) => {
    try {
        const deleted = await SeguimientoCliente.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ ok: false, token: req.csrfToken(), msg: 'Seguimiento no encontrado' });
        return res.json({ ok: true, token: req.csrfToken(), msg: 'Seguimiento eliminado' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al eliminar seguimiento' });
    }
};

ventasController.createActividad = async (req, res) => {
    try {
        const { segId } = req.params;
        const { tipo, fecha, descripcion, resultado } = req.body;
        const act = await ActividadSeguimiento.create({
            id: genId(), seguimientoId: segId, tipo, fecha, descripcion, resultado,
        });
        await SeguimientoCliente.update({ ultimoContacto: fecha }, { where: { id: segId } });
        return res.json({ ok: true, token: req.csrfToken(), data: act, msg: 'Actividad registrada' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al registrar actividad' });
    }
};

ventasController.deleteActividad = async (req, res) => {
    try {
        const deleted = await ActividadSeguimiento.destroy({ where: { id: req.params.actId } });
        if (!deleted) return res.status(404).json({ ok: false, token: req.csrfToken(), msg: 'Actividad no encontrada' });
        return res.json({ ok: true, token: req.csrfToken(), msg: 'Actividad eliminada' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al eliminar actividad' });
    }
};

/* ─────────────────────────────────────────
   EVENTOS CALENDARIO
───────────────────────────────────────── */
ventasController.getEventos = async (req, res) => {
    try {
        const data = await EventoCalendario.findAll({ order: [['fecha', 'ASC'], ['horaInicio', 'ASC']] });
        return res.json({ ok: true, token: req.csrfToken(), data });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al obtener eventos' });
    }
};

ventasController.createEvento = async (req, res) => {
    try {
        const { titulo, tipo, clienteId, fecha, horaInicio, horaFin, ubicacion, notas, estado } = req.body;
        if (!titulo) return res.status(400).json({ ok: false, token: req.csrfToken(), msg: 'Título requerido' });
        const ev = await EventoCalendario.create({
            id: genId(), titulo, tipo, clienteId: clienteId || null,
            fecha, horaInicio, horaFin, ubicacion, notas, estado: estado || 'programada',
        });
        return res.json({ ok: true, token: req.csrfToken(), data: ev, msg: 'Evento creado' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al crear evento' });
    }
};

ventasController.updateEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, tipo, clienteId, fecha, horaInicio, horaFin, ubicacion, notas, estado } = req.body;
        if (!titulo) return res.status(400).json({ ok: false, token: req.csrfToken(), msg: 'Título requerido' });
        const [updated] = await EventoCalendario.update(
            { titulo, tipo, clienteId: clienteId || null, fecha, horaInicio, horaFin, ubicacion, notas, estado },
            { where: { id } }
        );
        if (!updated) return res.status(404).json({ ok: false, token: req.csrfToken(), msg: 'Evento no encontrado' });
        return res.json({ ok: true, token: req.csrfToken(), msg: 'Evento actualizado' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al actualizar evento' });
    }
};

ventasController.deleteEvento = async (req, res) => {
    try {
        const deleted = await EventoCalendario.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ ok: false, token: req.csrfToken(), msg: 'Evento no encontrado' });
        return res.json({ ok: true, token: req.csrfToken(), msg: 'Evento eliminado' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al eliminar evento' });
    }
};

/* ─────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────── */
ventasController.getDashboard = async (req, res) => {
    try {
        const hoy = new Date();

        const diaSemana   = hoy.getDay();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - diaSemana);
        inicioSemana.setHours(0, 0, 0, 0);
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 7);

        const primerMes    = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const primerMesSig = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);

        const todayStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;

        const [
            clientesTotal,
            activos,
            inactivos,
            nuevosMes,
            actividadesSemana,
            embudoRows,
            rechazosRows,
            proximasRecs,
        ] = await Promise.all([
            Cliente.count(),
            SeguimientoCliente.count({ where: { activo: true } }),
            SeguimientoCliente.count({ where: { activo: false } }),
            Cliente.count({ where: { createdAt: { [Op.gte]: primerMes, [Op.lt]: primerMesSig } } }),
            ActividadSeguimiento.count({ where: { fecha: { [Op.gte]: inicioSemana, [Op.lt]: finSemana } } }),
            ProspectoVentas.findAll({
                attributes: ['etapa', [fn('COUNT', col('id')), 'cantidad']],
                group: ['etapa'],
                raw: true,
            }),
            ProspectoVentas.findAll({
                where: { etapa: 'Perdido', motivoRechazo: { [Op.not]: null } },
                attributes: ['motivoRechazo', [fn('COUNT', col('id')), 'cantidad']],
                group: ['motivoRechazo'],
                raw: true,
            }),
            EventoCalendario.findAll({
                where: { fecha: { [Op.gte]: todayStr }, estado: 'programada' },
                include: [{ model: Cliente, as: 'cliente', attributes: ['denominacion', 'razonSocial'], required: false }],
                order: [['fecha', 'ASC'], ['horaInicio', 'ASC']],
                limit: 6,
            }),
        ]);

        const ETAPAS_ORDER = ['Prospecto','En busca de contacto','Contactado','Interesado','Cotización','Negociación','Cerrado','Perdido'];
        const embudoMap = {};
        embudoRows.forEach(r => { embudoMap[r.etapa] = parseInt(r.cantidad) || 0; });
        const embudo = ETAPAS_ORDER.map(etapa => ({ etapa, cantidad: embudoMap[etapa] || 0 }));

        const totalProspectos = embudo.reduce((a, b) => a + b.cantidad, 0);
        const cerrados = embudoMap['Cerrado'] || 0;
        const tasa = totalProspectos > 0 ? Math.round((cerrados / totalProspectos) * 100) : 0;

        const motivosRechazo = rechazosRows
            .filter(r => r.motivoRechazo && r.motivoRechazo !== '')
            .map(r => ({ motivo: r.motivoRechazo, cantidad: parseInt(r.cantidad) || 0 }));

        const proximas = proximasRecs.map(ev => {
            const obj = ev.toJSON();
            return {
                id:         obj.id,
                titulo:     obj.titulo,
                tipo:       obj.tipo,
                fecha:      obj.fecha,
                horaInicio: obj.horaInicio,
                horaFin:    obj.horaFin,
                cliente:    obj.cliente
                    ? { denominacion: obj.cliente.denominacion || obj.cliente.razonSocial }
                    : null,
            };
        });

        return res.json({
            ok: true,
            token: req.csrfToken(),
            data: { clientesTotal, activos, inactivos, nuevosMes, actividadesSemana, tasa, embudo, motivosRechazo, proximas },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, token: req.csrfToken(), msg: 'Error al cargar dashboard' });
    }
};

export default ventasController;
