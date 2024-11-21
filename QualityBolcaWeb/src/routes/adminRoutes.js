import express from "express";
import {default as adminController} from './../controllers/adminController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import upload from "../middleware/subirImagen.js";

const router = express.Router();

router.get('/inicio', protegetRuta ,adminController.inicio);
router.get('/enviarfoto', adminController.enviar);
router.get('/requisicion', adminController.requisicion);
router.post('/requisicion', upload.single('imagen') , adminController.requisicion2);
router.get('/requisicionA', adminController.requisicionA);
router.get('/directorio', adminController.directorio);
router.post('/requisicionA', adminController.requisicionA2);
router.get('/cursos', adminController.cursos);
router.post('/cursos', adminController.cursos2);
router.get('/subirCurso', adminController.subirCurso);
router.post('/subirCurso', adminController.subirCurso2);
router.get('/mapa', adminController.mapa);
router.get('/valeSalida', adminController.valeSalida);
router.get('/voz', adminController.voz);
router.get('/crear', adminController.crear);



export default router;