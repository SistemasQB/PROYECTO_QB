import express from "express";
import {default as calidadController} from './../controllers/calidadController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import miMulter from "../public/clases/multer.js";
const mimulter = new miMulter() //valor por default es para imegenes, si no se cambian parametros


const router = express.Router();

router.get('/verificacion5s' ,calidadController.verificacion5s);
router.post('/verificacion5s' ,calidadController.verificacion5s2);
router.get('/evidencias' ,calidadController.evidencias);

// rutas de mejora continua
router.get('/administracionmejoras', calidadController.mejoracontinua);
router.post('/rechazarMejora', calidadController.rechazarMejora);
router.post("/actualizarMejoras", calidadController.ActualizarMejoras)

// rutas de bitacora
router.get('/bitacoraActividades', calidadController.bitacoraActividades);
router.post('/agregarActividad', calidadController.agregarActividad);
router.post('/procesoActividades', calidadController.actividades)



//rutas de actividades de usuario
router.get('/misActividades', calidadController.misActividades);
router.post('/asignarAvance',mimulter.multiplesArchivos('evidencia', 5) ,calidadController.asignarAvance);




export default router;