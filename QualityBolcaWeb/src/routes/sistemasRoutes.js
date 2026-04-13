import express from "express";
import {default as adminController} from './../controllers/sistemasController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import validarAcceso from "../middleware/validacion-permisos/calidad/permisos.js";


const router = express.Router();
//ruta de inicio
router.get('/inicio', adminController.inicio);
router.get('/dashboard', protegetRuta,adminController.dashboardTI);

//rutas de dashboard monitoreo
router.get('/monitoreo', protegetRuta, adminController.dashboardMonitoreo);
router.get('/api/monitoreo/tickets', protegetRuta, adminController.ticketsMonitoreo);
router.get('/api/monitoreo/requisiciones', protegetRuta, adminController.requisicionesMonitoreo);
router.get('/api/monitoreo/inventario', protegetRuta, adminController.inventarioMonitoreo);
router.get('/api/monitoreo/agentes', protegetRuta, adminController.agentesMonitoreo);
router.get('/api/monitoreo/sla', protegetRuta, adminController.slaMonitoreo);
router.get('/api/monitoreo/resolucion-semanal', protegetRuta, adminController.resolucionSemanal);

//rutas de usuarios (nom10001)
router.get('/usuarios', protegetRuta, adminController.usuarios);
router.get('/api/usuarios', protegetRuta, adminController.obtenerUsuarios);
router.put('/usuarios/:codigoempleado/actualizar', protegetRuta, adminController.actualizarUsuario);
router.post('/usuarios/departamentos', protegetRuta, adminController.crearDepartamento);
router.post('/usuarios/puestos', protegetRuta, adminController.crearPuesto);
router.post("/usuarios", adminController.crearUsuario);
router.get("/usuarios/datos-nuevo", adminController.obtenerDatosNuevoUsuario);
router.delete("/usuarios/:codigoempleado", protegetRuta, adminController.eliminarUsuario);

//rutas gestion de permisos usuarios
router.get('/admin-usuarios', adminController.adminUsuarios); 
router.put('/admin-usuarios/:codigoempleado/permisos', protegetRuta,adminController.actualizarPermisosUsuario);
router.put('/admin-usuarios/:codigoempleado/estado', protegetRuta, adminController.actualizarEstadoUsuario);
router.get('/nuevoUsuario', protegetRuta, adminController.nuevoUsuario);
router.post('/nuevoUsuario', protegetRuta,adminController.crearUsuario);


//rutas de tickets
router.get('/tickets', protegetRuta,adminController.levantamientoTicket);
router.get('/misTickets', protegetRuta,adminController.misTickets);
router.get('/admin-tickets', protegetRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),
    adminController.administracionTickets)
router.get('/crudTickets', protegetRuta,adminController.crudTickets)
router.post('/crudTickets', protegetRuta,adminController.crudTickets)
router.post('/tickets/:id/asignar', protegetRuta,adminController.asignarTicket);
router.post('/tickets/:id/reanudar', protegetRuta,adminController.reanudarTicket);
router.post('/tickets/:id/cerrar', protegetRuta,adminController.cerrarTicket);
router.post('/tickets/:id/observacion', protegetRuta, adminController.agregarObservacionTicket);
router.get('/tickets/:id/observaciones', protegetRuta, adminController.obtenerObservacionesTicket);

//ruta de dashboard
router.get('/dashboardTickets', protegetRuta,adminController.dashboardTickets);

//rutas de inventario

router.get('/inventario', protegetRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.inventario)

router.get('/inventario-data', protegetRuta,adminController.obtenerInventario); 
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
router.get('/addvales',protegetRuta,protegetRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.addvales);
router.post('/addvales',protegetRuta,adminController.addvales2);

//rutas de mantenimiento
router.get('/registroma',protegetRuta,adminController.registroMA); //lista de mantenimientos autonomos (realizados) no funciona y esta re fea candidata a eliminacion o reemplazo
router.get('/registromantenimiento',protegetRuta,adminController.registromantenimiento); //vista de mantenimientos autonomos realizados (mejor que el anterior)
router.get('/programamantenimiento',protegetRuta,adminController.programamantenimiento); // vista de mantenimiento (formato controlado)
router.get('/listadosolicitudes',protegetRuta,adminController.listadosolicitudes); //listado de solicitudes, (hay que revisar)
router.get('/mantenimientoautonomo',protegetRuta,adminController.mantenimientoautonomo); //vista de los mantenimientos que se han hecho

//apis
router.get('/api/:query2',adminController.api); //api de documentos
router.post('/apiDashboard', protegetRuta, adminController.apiDashboard); //api de dashboard


//rutas de requisicion de equipos
router.get('/requisicionEquipos',protegetRuta,adminController.requisicionEquipos) //formulario de requisicion
router.get('/adminRequisicionEquipos',protegetRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.administracionRequisicionEquipos)
router.post('/crudRequisicionEquipos',protegetRuta,adminController.CrudRequisicionEquipos)

export default router;