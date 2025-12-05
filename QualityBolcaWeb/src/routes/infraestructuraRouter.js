import express from 'express'
import infraestructuraController from '../controllers/infraestructuraController.js';
import miMulter from '../public/clases/multer.js';
import protegerRuta from '../middleware/protegetRuta.js';
import validarAcceso from '../middleware/validacion-permisos/calidad/permisos.js';

const multer = new miMulter('src/public/evidencias/check_List_Vehicular')
const infraestructuraRouter = express.Router();
//ruta de inicio
infraestructuraRouter.get('/inicio', infraestructuraController.inicio);

//rutas de orden de compra
infraestructuraRouter.get('/ordenCompra', protegerRuta,infraestructuraController.ordenCompra);
infraestructuraRouter.get('/historicoOrdenesCompra', protegerRuta,infraestructuraController.historicoOrdenes);
infraestructuraRouter.get('/controlInventario', protegerRuta,infraestructuraController.controlInventario);
infraestructuraRouter.post('/crudOrdenesCompra', protegerRuta,infraestructuraController.crudOrdenesCompra);

//rutas pedido insumos
infraestructuraRouter.get('/pedidoInsumos', protegerRuta,infraestructuraController.pedidoInsumos);
infraestructuraRouter.post('/crudPedidosInsumos', protegerRuta,infraestructuraController.crudPedidoInsumos);
infraestructuraRouter.get('/gestionPedidosInsumos', protegerRuta,infraestructuraController.gestionPedidosInsumos);


//rutas de logistica vehicular
infraestructuraRouter.get('/check-list-vehicular', protegerRuta,infraestructuraController.checklistVehicular);
infraestructuraRouter.post('/crudCheck-list-vehicular', protegerRuta, multer.multiplesArchivos('evidencias', 5) ,infraestructuraController.crudCheckListVehicular);
infraestructuraRouter.get('/check-list-vehicular/:id', protegerRuta,validarAcceso({
    roles: ['logistica vehicular'], permisos: ['analista logistica vehicular',"auxiliar logistica vehicular"], jerarquia: 4}),infraestructuraController.vistaCheckListVehicular);
infraestructuraRouter.get('/historico_check_list_vehicular', protegerRuta, validarAcceso({
    roles: ['logistica vehicular'], permisos: ['analista logistica vehicular',"auxiliar logistica vehicular"], jerarquia: 4
}),infraestructuraController.historicoCheckListVehicular);

export default infraestructuraRouter;