import express from "express";
import {default as adminController} from './../controllers/sistemasController.js';
import protegetRuta from "../middleware/protegetRuta.js";


const router = express.Router();
//ruta de inicio
router.get('/inicio', adminController.inicio);

//rutas de tickets
router.get('/tickets', protegetRuta,adminController.levantamientoTicket)
router.get('/admin-tickets', protegetRuta,adminController.administracionTickets)
router.get('/crudTickets', adminController.crudTickets)
router.post('/crudTickets', protegetRuta,adminController.crudTickets)
router.post('/tickets/:id/asignar', protegetRuta,adminController.asignarTicket);
router.post('/tickets/:id/pausar', adminController.pausarTicket);
router.post('/tickets/:id/reanudar', adminController.reanudarTicket);
router.put('/tickets/:id/terminar', adminController.terminarTicket);
router.post('/tickets/:id/cerrar', adminController.cerrarTicket);

//rutas de inventario
router.get('/inventario', protegetRuta,adminController.inventario)

router.get('/addinventario', protegetRuta, adminController.addinventario); //para abrir la pagina de asignacion o de generar vale
router.post('/addinventario',protegetRuta,adminController.addinventario2);
router.get('/tablainventario',protegetRuta,adminController.tablainventario); 

router.get('/listadopersonal',protegetRuta ,adminController.listadopersonal); //visualizar los vales del personal
//rutas de vales

router.put('/darBaja/:folio', adminController.darBajaVale); //dar de baja un vale
router.get('/inventario-disponible', adminController.inventarioDisponible); //ver inventario disponible
router.post('/agregar-equipos/:folio', adminController.agregarEquipos); //agregar equipos al vale
router.get('/equipos-asignados/:folio', adminController.equiposAsignados); //obtener equipos asignados
router.post('/remover-equipos/:folio', adminController.removerEquipos); //remover equipos del vale
router.post('/crear-vale', adminController.crearVale); // crear vales
router.get('/colaboradores-sin-vale', adminController.obtenerColaboradoresSinVale) //jalar los colaboradores sin vale


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