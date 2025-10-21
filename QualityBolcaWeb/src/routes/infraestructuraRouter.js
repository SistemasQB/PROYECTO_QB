import express from 'express'
import infraestructuraController from '../controllers/infraestructuraController.js';
import miMulter from '../public/clases/multer.js';

const multer = new miMulter('src/public/evidencias/check_List_Vehicular')
const infraestructuraRouter = express.Router();
//ruta de inicio
infraestructuraRouter.get('/inicio', infraestructuraController.inicio);

//rutas de orden de compra
infraestructuraRouter.get('/ordenCompra', infraestructuraController.ordenCompra);
infraestructuraRouter.get('/historicoOrdenesCompra', infraestructuraController.historicoOrdenes);
infraestructuraRouter.get('/controlInventario', infraestructuraController.controlInventario);

infraestructuraRouter.post('/crudOrdenesCompra', infraestructuraController.crudOrdenesCompra)  

//rutas de logistica vehicular
infraestructuraRouter.get('/check-list-vehicular', infraestructuraController.checklistVehicular);
infraestructuraRouter.post('/crudCheck-list-vehicular', multer.multiplesArchivos('evidencias', 5) ,infraestructuraController.crudCheckListVehicular);
infraestructuraRouter.get('/check-list-vehicular/:id', infraestructuraController.vistaCheckListVehicular);
infraestructuraRouter.get('/historico_check_list_vehicular', infraestructuraController.historicoCheckListVehicular);


export default infraestructuraRouter;