import express from "express";
import {default as calidadController} from './../controllers/calidadController.js';
import miMulter from "../public/clases/multer.js";
import permisos from '../middleware/validacion-permisos/barril_permisos.js'
import validarAcceso from "../middleware/validacion-permisos/calidad/permisos.js";
import protegerRuta from "../middleware/protegetRuta.js";

const mimulter = new miMulter('src/public/evidencias')
const multer5S = new miMulter("src/public/evidencias/5s")
const multerAnalisis = new miMulter(`src/public/evidencias/${new Date().getFullYear()}/mejoras/${new Date().getMonth() + 1}`)
const router = express.Router();

router.get('/inicio', protegerRuta, validarAcceso({roles: ['calidad', 'administrador'], permisos: ['jefe calidad', 'permitido', 'analista de calidad', 'auxiliar de calidad'], jerarquia: 5}), calidadController.inicio);
// rutas de 5s
router.get('/administracionEvidencias' ,protegerRuta, validarAcceso({roles: ['calidad', 'administrador'], permisos: ['jefe calidad', 'permitido', 'analista de calidad', 'auxiliar de calidad'], 
    jerarquia: 5}) ,calidadController.evidencias); //liga de visualizacion de evidencias
router.post('/evidencias',protegerRuta,calidadController.evidencias2); 

// rutas de mejora continua
router.get('/administracionmejoras', protegerRuta,validarAcceso({roles: ['calidad'], permisos: ['analista', 'auxiliar'], jerarquia: 5}), calidadController.administracionmejoras); //vista de comite de mejoras (comite)
router.get('/mejoracontinua',protegerRuta, calidadController.mejoracontinua); // vista de ingreso de mejoras nuevas (personal)
router.post('/crudMejoras', protegerRuta, multerAnalisis.archivoUnico('tituloAnalisis', 1),calidadController.crudMejoras); //modificacion de mejoras (abstracta)

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
router.get('/formatoVerificacion', protegerRuta,validarAcceso({roles: ['calidad'], permisos: ['analista', 'auxiliar', 'becario'], jerarquia: 5}),calidadController.verificacion5s)
router.post('/ingresarFormatoVerificacion', protegerRuta,protegerRuta,validarAcceso({roles: ['calidad'], permisos: ['analista', 'auxiliar', 'becario'], jerarquia: 5}), multer5S.multiplesArchivos('evidencia',10),calidadController.ingresarRegistro5s)

//rutas de auditorias
router.get('/agregarAuditoria', protegerRuta, validarAcceso({roles: ['calidad'], permisos: ['analista', 'auxiliar'], jerarquia: 5}),calidadController.agregarAuditoria)
router.post('/crudAuditorias', protegerRuta, validarAcceso({roles: ['calidad'], permisos: ['analista', 'auxiliar', 'becario'], jerarquia: 5}) ,calidadController.crudAuditorias)

export default router;