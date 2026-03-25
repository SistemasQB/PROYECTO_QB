import express from 'express'
import protegerRuta from "../middleware/protegetRuta.js";
import controllerServicioCliente from '../controllers/servicioClienteController.js';
import validarApiKey from "../middleware/validacion_apiKey.js";

const routerServicioCliente = express.Router();

//rutas de horas cobro
routerServicioCliente.get('/formularioHorasCobro', protegerRuta,controllerServicioCliente.formularioHorasCobro);
routerServicioCliente.post('/crudHorasCobro', protegerRuta,controllerServicioCliente.crudHorasCobro);

routerServicioCliente.get('/getRequisiciones', validarApiKey, controllerServicioCliente.obtenerRequisiciones);


export default routerServicioCliente;
