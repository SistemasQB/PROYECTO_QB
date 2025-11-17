import express from 'express'
import protegerRuta from "../middleware/protegetRuta.js";
import controllerServicioCliente from '../controllers/servicioClienteController.js';


const routerServicioCliente = express.Router();

routerServicioCliente.get('/formularioHorasCobro', controllerServicioCliente.formularioHorasCobro);

export default routerServicioCliente;
