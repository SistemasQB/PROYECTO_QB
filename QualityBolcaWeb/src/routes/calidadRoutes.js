import express from "express";
import {default as calidadController} from './../controllers/calidadController.js';
import miMulter from "../public/clases/multer.js";
import permisos from '../middleware/validacion-permisos/barril_permisos.js'
import protegerRuta from "../middleware/protegetRuta.js";

const mimulter = new miMulter('src/public/evidencias')
const multer5S = new miMulter("src/public/evidencias/5s")
const router = express.Router();

router.get('/inicio', calidadController.inicio);

// rutas de 5s
router.get('/evidencias' ,protegerRuta ,calidadController.evidencias);
router.post('/evidencias',calidadController.evidencias2);

// rutas de mejora continua
router.get('/administracionmejoras', protegerRuta,calidadController.administracionmejoras);
router.post('/rechazarMejora', protegerRuta,calidadController.rechazarMejora);
router.post("/actualizarMejoras", protegerRuta,calidadController.ActualizarMejoras)
router.get('/mejoracontinua',protegerRuta, calidadController.mejoracontinua);
router.post('/crudMejoras', protegerRuta,calidadController.crudMejoras);

// rutas de bitacora
router.get('/bitacoraActividades', protegerRuta,permisos.permisosCalidad(
    {roles: ['calidad'], permisos: ['administrador','jefe calidad', 'permitido'], jerarquia: 3}),calidadController.bitacoraActividades);
router.post('/agregarActividad', protegerRuta,calidadController.agregarActividad);
router.post('/procesoActividades',protegerRuta ,calidadController.actividades)
// router.get('/recordatorio',protegerRutaRuta ,calidadController.recordatorio);

//rutas de actividades de usuario
router.get('/misActividades', protegerRuta, calidadController.misActividades);
router.post('/asignarAvance',protegerRuta,mimulter.multiplesArchivos('evidencia', 5) ,calidadController.asignarAvance);

//rutas de directorio
router.get('/directorioPersonal', protegerRuta, permisos.permisosCalidad(
    {   roles: ['calidad'], permisos: ['administrador','jefe calidad'], jerarquia: 3}),
    calidadController.directorioPersonal);
router.post('/crud',protegerRuta ,calidadController.CrudDirectorio);

//api de calidad
router.get('/api/:documento', calidadController.api);

// rutas 5´s
router.get('/formatoVerificacion', protegerRuta,calidadController.verificacion5s)
router.post('/ingresarFormatoVerificacion', protegerRuta, multer5S.multiplesArchivos('evidencia',10),calidadController.ingresarRegistro5s)

//rutas de auditorias
router.get('/agregarAuditoria', protegerRuta,calidadController.agregarAuditoria)
router.post('/crudAuditorias', protegerRuta, calidadController.crudAuditorias)

export default router;