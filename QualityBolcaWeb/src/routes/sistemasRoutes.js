import express from "express";
import {default as adminController} from './../controllers/sistemasController.js';
import validarAcceso from "../middleware/validacion-permisos/calidad/permisos.js";
import protegerRuta from "../middleware/protegetRuta.js";


const router = express.Router();
//ruta de inicio
router.get('/inicio', adminController.inicio);
router.get('/dashboard', protegerRuta,adminController.dashboardTI);

//rutas de usuarios (nom10001)
router.get('/usuarios', protegerRuta, adminController.usuarios);
router.get('/api/usuarios', protegerRuta, adminController.obtenerUsuarios);
router.put('/usuarios/:codigoempleado/actualizar', protegerRuta, adminController.actualizarUsuario);
router.post("/usuarios", protegerRuta,adminController.crearUsuario);
router.get("/usuarios/datos-nuevo", protegerRuta,adminController.obtenerDatosNuevoUsuario);
router.delete("/usuarios/:codigoempleado", protegerRuta, adminController.eliminarUsuario);

//rutas gestion de permisos usuarios
router.get('/admin-usuarios', protegerRuta,adminController.adminUsuarios); 
router.put('/admin-usuarios/:codigoempleado/permisos', protegerRuta,adminController.actualizarPermisosUsuario);
router.put('/admin-usuarios/:codigoempleado/estado', protegerRuta, adminController.actualizarEstadoUsuario);
router.get('/nuevoUsuario', protegerRuta, adminController.nuevoUsuario);
router.post('/nuevoUsuario', protegerRuta,adminController.crearUsuario);


//rutas de tickets
router.get('/tickets', protegerRuta,adminController.levantamientoTicket);
router.get('/misTickets', protegerRuta,adminController.misTickets);
router.get('/admin-tickets', protegerRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),
    adminController.administracionTickets)
router.get('/crudTickets', protegerRuta,adminController.crudTickets)
router.post('/crudTickets', protegerRuta,adminController.crudTickets)
router.post('/tickets/:id/asignar', protegerRuta,adminController.asignarTicket);
router.post('/tickets/:id/reanudar', protegerRuta,adminController.reanudarTicket);
router.post('/tickets/:id/cerrar', protegerRuta,adminController.cerrarTicket);
router.post('/tickets/:id/observacion', protegerRuta, adminController.agregarObservacionTicket);
router.get('/tickets/:id/observaciones', protegerRuta, adminController.obtenerObservacionesTicket);

//ruta de dashboard
router.get('/dashboardTickets', protegerRuta,adminController.dashboardTickets);

//rutas de inventario

router.get('/inventario', protegerRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.inventario)

router.get('/inventario-data', protegerRuta,adminController.obtenerInventario); 
router.get('/addinventario', protegerRuta,validarAcceso({

    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.addinventario); //para abrir la pagina de asignacion o de generar vale
router.post('/addinventario',protegerRuta,adminController.addinventario2);
router.get('/tablainventario',protegerRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),protegerRuta,adminController.tablainventario); 

router.get('/listadopersonal',protegerRuta, validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}) ,adminController.listadopersonal); //visualizar los vales del personal
//rutas de vales

router.put('/darBaja/:folio', protegerRuta,adminController.darBajaVale); //dar de baja un vale
router.get('/inventario-disponible', protegerRuta, validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.inventarioDisponible); //ver inventario disponible
router.post('/agregar-equipos/:folio', protegerRuta, adminController.agregarEquipos); //agregar equipos al vale
router.get('/equipos-asignados/:folio', protegerRuta,adminController.equiposAsignados); //obtener equipos asignados
router.post('/remover-equipos/:folio', protegerRuta,adminController.removerEquipos); //remover equipos del vale
router.post('/crear-vale', protegerRuta,adminController.crearVale); // crear vales
router.get('/colaboradores-sin-vale', protegerRuta,adminController.obtenerColaboradoresSinVale) //jalar los colaboradores sin vale
router.get('/addvales',protegerRuta, validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.addvales);
router.post('/addvales',protegerRuta,adminController.addvales2);

//rutas de mantenimiento
router.get('/registroma',protegerRuta,adminController.registroMA); //lista de mantenimientos autonomos (realizados) no funciona y esta re fea candidata a eliminacion o reemplazo
router.get('/registromantenimiento',protegerRuta,adminController.registromantenimiento); //vista de mantenimientos autonomos realizados (mejor que el anterior)
router.get('/programamantenimiento',protegerRuta,adminController.programamantenimiento); // vista de mantenimiento (formato controlado)
router.get('/listadosolicitudes',protegerRuta,adminController.listadosolicitudes); //listado de solicitudes, (hay que revisar)
router.get('/mantenimientoautonomo',protegerRuta,adminController.mantenimientoautonomo); //vista de los mantenimientos que se han hecho

//apis
router.post('/apiDashboard', protegerRuta, adminController.apiDashboard); //api de dashboard


//rutas de requisicion de equipos
router.get('/requisicionEquipos',protegerRuta,adminController.requisicionEquipos) //formulario de requisicion
router.get('/adminRequisicionEquipos',protegerRuta,validarAcceso({
    roles: ['tecnologias de la informacion'], permisos: ['auxiliar de tecnologias de la informacion', 'analista de tecnologias de la informacion'], jerarquia: 5}),adminController.administracionRequisicionEquipos)
router.post('/crudRequisicionEquipos',protegerRuta,adminController.CrudRequisicionEquipos)

export default router;