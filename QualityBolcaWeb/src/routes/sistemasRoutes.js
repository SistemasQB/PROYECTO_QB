import express from "express";
import {default as adminController} from './../controllers/sistemasController.js';
import protegetRuta from "../middleware/protegetRuta.js";


const router = express.Router();
//ruta de inicio
router.get('/inicio', adminController.inicio);

//rutas de tickets
router.get('/tickets', protegetRuta,adminController.levantamientoTicket)
router.get('/admin-tickets', protegetRuta,adminController.administracionTickets)
router.post('/crudTickets', protegetRuta,adminController.crudTickets)

//rutas de inventario
router.get('/inventario', adminController.inventario)

router.get('/addinventario',adminController.addinventario); //para abrir la pagina de asignacion o de generar vale
router.post('/addinventario',adminController.addinventario2);
router.get('/tablainventario',adminController.tablainventario); 

//rutas de vales
router.get('/listadopersonal',adminController.listadopersonal); //visualizar los vales del personal
router.put('/darBaja/:folio', adminController.darBajaVale); //dar de baja un vale

//rutas de los vales
router.get('/addvales',adminController.addvales);
router.post('/addvales',adminController.addvales2);


//rutas de mantenimiento
router.get('/registroma',adminController.registroMA); //lista de mantenimientos autonomos (realizados)
router.get('/registromantenimiento',adminController.registromantenimiento); //vista de mantenimientos autonomos realizados (mejor que el anterior)
router.get('/programamantenimiento',adminController.programamantenimiento); // vista de mantenimiento (formato controlado)
router.get('/listadosolicitudes',adminController.listadosolicitudes);
router.get('/mantenimientoautonomo',adminController.mantenimientoautonomo); //vista de los mantenimientos que se han hecho

router.get('/api/:query2',adminController.api);


export default router;