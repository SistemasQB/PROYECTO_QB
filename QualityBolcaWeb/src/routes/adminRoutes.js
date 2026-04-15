import express from "express";
import { default as adminController } from './../controllers/adminController.js';
import multer from "multer";
import protegetRuta from "../middleware/protegetRuta.js";
import upload from "../middleware/subirImagen.js";
import upload2 from "../middleware/valeresguardo.js";
import upload3 from "../middleware/agregaranalisis.js";
import upload4 from "../middleware/agregarevidencia.js";
// import {default as imagenEnviar} from "../../index.js";

const router = express.Router();

 //ruta de inicio de la aplicacion
// router.get('/inicio', protegetRuta, adminController.inicio);

//ruta del directorio
router.get('/directorio',protegetRuta ,adminController.directorio);

router.get('/registroma', protegetRuta, adminController.registroma);
router.post('/registroma', protegetRuta, adminController.registroma2);
router.get('/subiranalisis/:mejoraid', protegetRuta, adminController.subiranalisis);
router.post('/subiranalisis/:mejoraid', protegetRuta,upload3.single('analisisFile'), adminController.subiranalisis2);
router.get('/subirevidencia/:mejoraid', protegetRuta, adminController.subirevidencia);
router.post('/subirevidencia/:mejoraid', protegetRuta,upload4.single('evidenciaFile'), adminController.subirevidencia2);
router.get('/api', adminController.api);

router.get('/valeresguardo',protegetRuta, adminController.valeresguardo);
router.post('/valeresguardo', protegetRuta, adminController.valeresguardo3);
router.post('/subirfirma',protegetRuta, upload2.single('firmaFile'),adminController.valeresguardo2);
router.get('/generarfirma/:codigo', adminController.generarfirma);
router.get('/mantenimientoautonomo', protegetRuta, adminController.mantenimientoautonomo);
router.post('/mantenimientoautonomo', protegetRuta, adminController.mantenimientoautonomo2);

export default router;
