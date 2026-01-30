import express from "express";
import {default as adminController} from './../controllers/sistemasController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import validarAcceso from "../middleware/validacion-permisos/calidad/permisos.js";


const router = express.Router();
//ruta de inicio
router.get('/inicio', adminController.inicio);

//rutas gestion de usuarios
router.get('/admin-usuarios', adminController.adminUsuarios);

//rutas de tickets
router.get('/tickets', protegetRuta,adminController.levantamientoTicket)
router.get('/admin-tickets', protegetRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),
    adminController.administracionTickets)
router.get('/crudTickets', protegetRuta,adminController.crudTickets)
router.post('/crudTickets', protegetRuta,adminController.crudTickets)
router.post('/tickets/:id/asignar', protegetRuta,adminController.asignarTicket);
router.post('/tickets/:id/pausar', protegetRuta,adminController.pausarTicket);
router.post('/tickets/:id/reanudar', protegetRuta,adminController.reanudarTicket);
router.put('/tickets/:id/terminar', protegetRuta,adminController.terminarTicket);
router.post('/tickets/:id/cerrar', protegetRuta,adminController.cerrarTicket);
router.post('/tickets/:id/observacion', protegetRuta,adminController.agregarObservacionTicket);
router.get('/tickets/:id/observaciones', protegetRuta, adminController.obtenerObservacionesTicket);

//rutas de inventario
router.get('/inventario', protegetRuta,protegetRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.inventario)

router.get('/addinventario', protegetRuta, protegetRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.addinventario); //para abrir la pagina de asignacion o de generar vale
router.post('/addinventario',protegetRuta,adminController.addinventario2);
router.get('/tablainventario',protegetRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),protegetRuta,adminController.tablainventario); 

router.get('/listadopersonal',protegetRuta,protegetRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}) ,adminController.listadopersonal); //visualizar los vales del personal
//rutas de vales

router.put('/darBaja/:folio', protegetRuta,adminController.darBajaVale); //dar de baja un vale
router.get('/inventario-disponible', protegetRuta,protegetRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.inventarioDisponible); //ver inventario disponible
router.post('/agregar-equipos/:folio', adminController.agregarEquipos); //agregar equipos al vale
router.get('/equipos-asignados/:folio', protegetRuta,adminController.equiposAsignados); //obtener equipos asignados
router.post('/remover-equipos/:folio', protegetRuta,adminController.removerEquipos); //remover equipos del vale
router.post('/crear-vale', protegetRuta,adminController.crearVale); // crear vales
router.get('/colaboradores-sin-vale', protegetRuta,adminController.obtenerColaboradoresSinVale) //jalar los colaboradores sin vale


//rutas de los vales
router.get('/addvales',protegetRuta,protegetRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.addvales);
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
router.get('/adminRequisicionEquipos',protegetRuta,protegetRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.administracionRequisicionEquipos)
router.post('/crudRequisicionEquipos',protegetRuta,adminController.CrudRequisicionEquipos)

export default router;