import express from "express";
import { default as adminController } from './../controllers/adminController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import upload from "../middleware/subirImagen.js";

const router = express.Router();

router.get('/inicio', protegetRuta, adminController.inicio);
router.get('/enviarfoto', adminController.enviar);
router.get('/requisicion', adminController.requisicion);
router.post('/requisicion', adminController.requisicion2);
router.post('/requisicionImg', upload.single('imagen'));
// router.post('/requisicionImg', adminController.requisicion3);
router.get('/requisicionA', adminController.requisicionA);
router.get('/directorio', adminController.directorio);
router.post('/requisicionA', adminController.requisicionA2);
router.get('/cursos', adminController.cursos);
router.post('/cursos', adminController.cursos2);
router.get('/subirCurso', adminController.subirCurso);
router.post('/subirCurso', adminController.subirCurso2);
router.get('/solicitudServicio', adminController.solicitudServicio);
router.post('/solicitudServicio', adminController.solicitudServicio2);
router.get('/pedirCurso', adminController.pedirCurso);
router.post('/pedirCurso', adminController.pedirCurso2);
router.get('/vacaciones', adminController.vacaciones);
router.post('/vacaciones', adminController.vacaciones2);
router.get('/registroma', protegetRuta, adminController.registroma);
router.post('/registroma', protegetRuta, adminController.registroma2);
router.get('/mapa', adminController.mapa);
router.get('/valeSalida', adminController.valeSalida);
router.get('/voz', adminController.voz);
router.get('/crear', adminController.crear);


export default router;

