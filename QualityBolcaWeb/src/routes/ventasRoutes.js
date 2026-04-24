import express from 'express';
import protegerRuta from '../middleware/protegetRuta.js';
import ventasController from '../controllers/ventasController.js';

const ventasRouter = express.Router();

ventasRouter.get('/crm/inicio', ventasController.dashboard);
ventasRouter.get('/crm/clientes', protegerRuta, ventasController.clientes);
ventasRouter.get('/crm/agendaVentas', protegerRuta, ventasController.agendaVentas);
ventasRouter.get('/crm/seguimiento', protegerRuta, ventasController.seguimiento);
ventasRouter.get('/crm/calendario', protegerRuta, ventasController.calendario);

export default ventasRouter;