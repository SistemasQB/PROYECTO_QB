import express from 'express';
import protegerRuta from '../middleware/protegetRuta.js';
import ventasController from '../controllers/ventasController.js';

const ventasRouter = express.Router();

/* ── Vistas ── */
ventasRouter.get('/crm/inicio', protegerRuta, ventasController.dashboard);
ventasRouter.get('/crm/clientes',    protegerRuta, ventasController.clientes);
ventasRouter.get('/crm/agendaVentas',protegerRuta, ventasController.agendaVentas);
ventasRouter.get('/crm/seguimiento', protegerRuta, ventasController.seguimiento);
ventasRouter.get('/crm/calendario',  protegerRuta, ventasController.calendario);

/* ── API Dashboard ── */
ventasRouter.get('/api/dashboard', protegerRuta, ventasController.getDashboard);

/* ── API Clientes ── */
ventasRouter.get('/api/cotizadores',     protegerRuta, ventasController.getCotizadores);
ventasRouter.get   ('/api/clientes',protegerRuta, ventasController.getClientes);
ventasRouter.post  ('/api/clientes',     protegerRuta, ventasController.createCliente);
ventasRouter.put   ('/api/clientes/:id', protegerRuta, ventasController.updateCliente);
ventasRouter.delete('/api/clientes/:id', protegerRuta, ventasController.deleteCliente);

/* ── API Prospectos ── */
ventasRouter.get   ('/api/prospectos',     protegerRuta, ventasController.getProspectos);
ventasRouter.post  ('/api/prospectos',     protegerRuta, ventasController.createProspecto);
ventasRouter.put   ('/api/prospectos/:id', protegerRuta, ventasController.updateProspecto);
ventasRouter.delete('/api/prospectos/:id', protegerRuta, ventasController.deleteProspecto);

/* ── API Seguimientos ── */
ventasRouter.get   ('/api/seguimientos',                    protegerRuta, ventasController.getSeguimientos);
ventasRouter.post  ('/api/seguimientos',                    protegerRuta, ventasController.createSeguimiento);
ventasRouter.put   ('/api/seguimientos/:id',                protegerRuta, ventasController.updateSeguimiento);
ventasRouter.delete('/api/seguimientos/:id',                protegerRuta, ventasController.deleteSeguimiento);
ventasRouter.post  ('/api/seguimientos/:segId/actividades', protegerRuta, ventasController.createActividad);
ventasRouter.delete('/api/actividades/:actId',              protegerRuta, ventasController.deleteActividad);

/* ── API Eventos ── */
ventasRouter.get   ('/api/eventos',     protegerRuta, ventasController.getEventos);
ventasRouter.post  ('/api/eventos',     protegerRuta, ventasController.createEvento);
ventasRouter.put   ('/api/eventos/:id', protegerRuta, ventasController.updateEvento);
ventasRouter.delete('/api/eventos/:id', protegerRuta, ventasController.deleteEvento);

export default ventasRouter;
