import express from "express";
import { default as adminController } from './../controllers/adminController.js';
import multer from "multer";
import protegetRuta from "../middleware/protegetRuta.js";
import upload from "../middleware/subirImagen.js";
import upload2 from "../middleware/valeresguardo.js";
// import upload3 from "../middleware/subirmantenimientoA.js";
// import {default as imagenEnviar} from "../../index.js";

const router = express.Router();

// Configurar Multer (para almacenar imagen en memoria)
const storage = multer.memoryStorage();
const uploadmantenimiento = multer({ storage: storage });


router.get('/inicio', protegetRuta, adminController.inicio);
router.get('/enviarfoto', adminController.enviar);
router.get('/requisicion', adminController.requisicion);
router.post('/requisicion', adminController.requisicion2);
router.post('/requisicionImg', upload.single('imagen'));
// router.post('/requisicionImg', adminController.requisicion3);
router.get('/requisicionA', adminController.requisicionA);
router.get('/directorio',protegetRuta ,adminController.directorio);
router.post('/requisicionA', adminController.requisicionA2);
router.get('/cursos', adminController.cursos);
router.post('/cursos', adminController.cursos2);
router.get('/subirCurso', adminController.subirCurso);
router.post('/subirCurso', adminController.subirCurso2);
router.get('/solicitudServicio', protegetRuta, adminController.solicitudServicio);
router.post('/solicitudServicio', protegetRuta, adminController.solicitudServicio2);
router.get('/pedirCurso', adminController.pedirCurso);
router.post('/pedirCurso', adminController.pedirCurso2);
router.get('/solicitudesCursos', adminController.solicitudesCursos);
router.post('/solicitudesCursos', adminController.solicitudesCursos2);
router.get('/vacaciones',protegetRuta, adminController.vacaciones);
router.post('/vacaciones', protegetRuta, adminController.vacaciones2);
router.get('/registroma', protegetRuta, adminController.registroma);
router.post('/registroma', protegetRuta, adminController.registroma2);
router.get('/mapa', adminController.mapa);
router.get('/valeSalida', adminController.valeSalida);
router.get('/voz', adminController.voz);
router.get('/crear', adminController.crear);
router.get('/mejoracontinua',protegetRuta, adminController.mejoracontinua);
router.post('/mejoracontinua', protegetRuta, adminController.mejoracontinua2);
router.get('/subiranalisis/:id', protegetRuta, adminController.subiranalisis);
router.post('/subiranalisis/:id', protegetRuta,upload.single('analisisFile'), adminController.subiranalisis2);
router.get('/reuniones', adminController.reuniones);
router.post('/reuniones', adminController.reuniones2);
router.get('/glosario', adminController.glosario);
router.get('/api', adminController.api);
router.get('/organigrama', adminController.organigrama);
router.get('/valeresguardo',protegetRuta, adminController.valeresguardo);
router.post('/valeresguardo', protegetRuta, adminController.valeresguardo3);
router.post('/subirfirma',protegetRuta, upload2.single('firmaFile'),adminController.valeresguardo2);
router.get('/generarfirma/:codigo', adminController.generarfirma);
router.get('/mantenimientoautonomo', protegetRuta, adminController.mantenimientoautonomo);
router.post('/mantenimientoautonomo', protegetRuta, adminController.mantenimientoautonomo2);
router.get('/buzonquejas',protegetRuta ,adminController.buzonquejas);
router.post('/buzonquejas',protegetRuta ,adminController.buzonquejas2);
router.get('/publicarEvento',protegetRuta ,adminController.publicarEvento);
router.post('/publicarEvento',protegetRuta ,adminController.publicarEvento2);



export default router;
