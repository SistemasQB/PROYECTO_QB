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
router.get('/addinventario',adminController.addinventario);
router.post('/addinventario',adminController.addinventario2);
router.get('/tablainventario',adminController.tablainventario);

//rutas de vales
router.get('/listadopersonal',adminController.listadopersonal);



router.get('/registroma',adminController.registroMA);
router.get('/addvales',adminController.addvales);
router.post('/addvales',adminController.addvales2);
router.get('/api/:query2',adminController.api);
router.get('/registromantenimiento',adminController.registromantenimiento);
router.get('/programamantenimiento',adminController.programamantenimiento);
router.get('/listadosolicitudes',adminController.listadosolicitudes);
router.get('/mantenimientoautonomo',adminController.mantenimientoautonomo);



export default router;