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
router.get('/inventario', protegetRuta,adminController.inventario)

router.get('/addinventario', protegetRuta, adminController.addinventario); //para abrir la pagina de asignacion o de generar vale
router.post('/addinventario',protegetRuta,adminController.addinventario2);
router.get('/tablainventario',protegetRuta,adminController.tablainventario); 

//rutas de vales
router.get('/listadopersonal',protegetRuta ,adminController.listadopersonal); //visualizar los vales del personal

//rutas de los vales
router.get('/addvales',protegetRuta,adminController.addvales);
router.post('/addvales',protegetRuta,adminController.addvales2);


//rutas de mantenimiento
router.get('/registroma',protegetRuta,adminController.registroMA); //lista de mantenimientos autonomos (realizados)
router.get('/registromantenimiento',protegetRuta,adminController.registromantenimiento); //vista de mantenimientos autonomos realizados (mejor que el anterior)
router.get('/programamantenimiento',protegetRuta,adminController.programamantenimiento); // vista de mantenimiento (formato controlado)
router.get('/listadosolicitudes',protegetRuta,adminController.listadosolicitudes);
router.get('/mantenimientoautonomo',protegetRuta,adminController.mantenimientoautonomo); //vista de los mantenimientos que se han hecho

//api de documentos
router.get('/api/:query2',adminController.api);

//rutas de requisicion de equipos
router.get('/requisicionEquipos',protegetRuta,adminController.requisicionEquipos)
router.get('/adminRequisicionEquipos',protegetRuta,adminController.administracionRequisicionEquipos)
router.post('/crudRequisicionEquipos',protegetRuta,adminController.CrudRequisicionEquipos)





export default router;