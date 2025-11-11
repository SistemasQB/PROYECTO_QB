import express from "express";
import {default as calidadController} from './../controllers/calidadController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import miMulter from "../public/clases/multer.js";
import permisos from '../middleware/validacion-permisos/barril_permisos.js'

const mimulter = new miMulter('src/public/evidencias')
const multer5S = new miMulter("src/public/evidencias/5s")
const router = express.Router();

router.get('/inicio', calidadController.inicio);

// rutas de 5s
// router.get('/verificacion5s' ,calidadController.verificacion5s);
// router.post('/verificacion5s' ,calidadController.verificacion5s2);
// router.get('/evidencias' ,calidadController.evidencias);
// router.post('/evidencias', calidadController.evidencias2);

// rutas de mejora continua
router.get('/administracionmejoras', calidadController.mejoracontinua);
router.post('/rechazarMejora', calidadController.rechazarMejora);
router.post("/actualizarMejoras", calidadController.ActualizarMejoras)


// rutas de bitacora
router.get('/bitacoraActividades', protegetRuta,permisos.permisosCalidad(
    {   roles: ['calidad'], permisos: ['administrador','jefe calidad', 'permitido'], jerarquia: 3}),calidadController.bitacoraActividades);
router.post('/agregarActividad', protegetRuta,calidadController.agregarActividad);
router.post('/procesoActividades',protegetRuta ,calidadController.actividades)
// router.get('/recordatorio',protegetRuta ,calidadController.recordatorio);

//rutas de actividades de usuario
router.get('/misActividades', protegetRuta, calidadController.misActividades);
router.post('/asignarAvance',protegetRuta,mimulter.multiplesArchivos('evidencia', 5) ,calidadController.asignarAvance);

//rutas de directorio
router.get('/directorioPersonal', protegetRuta, permisos.permisosCalidad(
    {   roles: ['calidad'], permisos: ['administrador','jefe calidad'], jerarquia: 3}),
    calidadController.directorioPersonal);
router.post('/crud',protegetRuta ,calidadController.CrudDirectorio);

//api de calidad
router.get('/api/:documento', calidadController.api);

// rutas 5´s
router.get('/formatoVerificacion', protegetRuta,calidadController.verificacion5s)
router.post('/ingresarFormatoVerificacion', protegetRuta, multer5S.multiplesArchivos('evidencia',10),calidadController.ingresarRegistro5s)

//rutas de auditorias
router.get('/agregarAuditoria', calidadController.agregarAuditoria)

export default router;