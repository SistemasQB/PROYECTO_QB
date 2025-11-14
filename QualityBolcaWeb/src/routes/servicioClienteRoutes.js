import express from 'express'
import protegerRuta from "../middleware/protegetRuta";
import controllerServicioCliente from '../controllers/servicioClienteController';


const routerServicioCliente = express.Router();

routerServicioCliente.get('formularioHorasCobro')

