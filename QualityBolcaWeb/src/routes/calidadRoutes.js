import express from "express";
import {default as calidadController} from './../controllers/calidadController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import miMulter from "../public/clases/multer.js";
const mimulter = new miMulter('src/public/evidencias') 


const router = express.Router();

router.get('/verificacion5s' ,calidadController.verificacion5s);
router.post('/verificacion5s' ,calidadController.verificacion5s2);
router.get('/evidencias' ,calidadController.evidencias);

// rutas de mejora continua
router.get('/administracionmejoras', calidadController.mejoracontinua);
router.post('/rechazarMejora', calidadController.rechazarMejora);
router.post("/actualizarMejoras", calidadController.ActualizarMejoras)

// rutas de bitacora
router.get('/bitacoraActividades', protegetRuta, calidadController.bitacoraActividades);
router.post('/agregarActividad',protegetRuta, calidadController.agregarActividad);
router.post('/procesoActividades',protegetRuta, calidadController.actividades)



//rutas de actividades de usuario
router.get('/misActividades',protegetRuta, calidadController.misActividades);
router.post('/asignarAvance',protegetRuta, mimulter.multiplesArchivos('evidencia', 5), calidadController.asignarAvance);




export default router;