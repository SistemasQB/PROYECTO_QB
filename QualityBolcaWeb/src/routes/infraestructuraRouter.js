import express from 'express'
import infraestructuraController from '../controllers/infraestructuraController.js';
import miMulter from '../public/clases/multer.js';
import protegerRuta from '../middleware/protegetRuta.js';
import validarAcceso from '../middleware/validacion-permisos/calidad/permisos.js';

const multer = new miMulter('src/public/evidencias/check_List_Vehicular')
const uGas = new miMulter('src/public/evidencias/gastos')
const infraestructuraRouter = express.Router();

//ruta de inicio
infraestructuraRouter.get('/inicio', protegerRuta, validarAcceso({
    roles:['compras', 'logistica vehicular'], permisos: ['auxiliar de compras y suministros', 'jefe de logistica vehicular', 'jefe de compras y suministros'], jerarquia: 5}),infraestructuraController.inicio);

//rutas de orden de compra (compras)
infraestructuraRouter.get('/ordenCompra', protegerRuta,infraestructuraController.ordenCompra);
infraestructuraRouter.get('/historicoOrdenesCompra', protegerRuta,validarAcceso({roles:['compras'], permisos: ['auxiliar de compras y suministros', 'jefe de compras y suministros'], jerarquia: 5}) ,infraestructuraController.historicoOrdenes);
infraestructuraRouter.get('/controlInventario',protegerRuta, validarAcceso({roles:['compras'], permisos: ['auxiliar de compras y suministros', 'jefe de compras y suministros'], jerarquia: 5}),infraestructuraController.controlInventario);
infraestructuraRouter.post('/crudOrdenesCompra', protegerRuta, validarAcceso({roles:['compras'], permisos: ['auxiliar de compras y suministros', 'jefe de compras y suministros'], jerarquia: 5}),infraestructuraController.crudOrdenesCompra);

//rutas pedido insumos (compras)
infraestructuraRouter.get('/pedidoInsumos', protegerRuta,infraestructuraController.pedidoInsumos);
infraestructuraRouter.post('/crudPedidosInsumos', protegerRuta,validarAcceso({roles:['compras'], permisos: ['auxiliar de compras y suministros', 'jefe de compras y suministros'], jerarquia: 5}), infraestructuraController.crudPedidoInsumos);
infraestructuraRouter.get('/gestionPedidosInsumos', protegerRuta,validarAcceso({roles:['compras'], permisos: ['auxiliar de compras y suministros', 'jefe de compras y suministros'], jerarquia: 5}),infraestructuraController.gestionPedidosInsumos);


//rutas de logistica vehicular 
infraestructuraRouter.get('/check-list-vehicular', protegerRuta,infraestructuraController.checklistVehicular); //liga de formato para llenado de checklist
infraestructuraRouter.post('/crudCheck-list-vehicular', protegerRuta, multer.multiplesArchivos('evidencias', 5) ,infraestructuraController.crudCheckListVehicular); //end point para poder manipular checklist
infraestructuraRouter.get('/check-list-vehicular/:id', protegerRuta,validarAcceso({roles: ['logistica vehicular'], permisos: ['analista logistica vehicular',"auxiliar logistica vehicular"], jerarquia: 5}), infraestructuraController.vistaCheckListVehicular);// consulta de checklist por id
infraestructuraRouter.get('/historico_check_list_vehicular', protegerRuta, validarAcceso({roles: ['logistica vehicular'], permisos: ['analista logistica vehicular',"auxiliar logistica vehicular"], jerarquia: 5}),infraestructuraController.historicoCheckListVehicular); //vista donde se visualizan todos los checkist realizados

//rutas de requsiciones de gastos
infraestructuraRouter.get('/requisicionGastos', protegerRuta,infraestructuraController.requisicionGastos); //vista de inicio de usuario
infraestructuraRouter.post('/crudRequisicionGastos', protegerRuta,uGas.archivoUnico('evidencia', 1) ,infraestructuraController.crudRequisicionGastos);
infraestructuraRouter.get('/crearRequisicionGastos', protegerRuta, infraestructuraController.crearRequisicionGastos);
infraestructuraRouter.get('/requisicionGastos/aprobaciones', protegerRuta, infraestructuraController.aprobacionesRequisicionGastos);
infraestructuraRouter.get('/requisicionGastos/misRequisiciones', protegerRuta, infraestructuraController.misRequisicionesGastos);
infraestructuraRouter.get('/requisicionGastos/comprobar', protegerRuta, infraestructuraController.comprobarRequisicionesGastos);

export default infraestructuraRouter;