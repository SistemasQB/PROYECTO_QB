import 'dotenv/config'
import express from "express";
import {default as customerController} from './../controllers/customerController.js';
import upload from "../middleware/subirpdf.js";

const router = express.Router();

router.get('/', customerController.formularioLogin);
router.get('/login', customerController.formularioLogin);
router.post('/login', customerController.autenticar);
router.get('/registro', customerController.formularioRegistro);
router.post('/registro', customerController.registrar);
router.get('/confirmar/:token', customerController.confirmar)
router.get('/requisicion', customerController.requisicion);
router.post('/requisicion', customerController.requisicion2);
router.get('/olvide-password', customerController.formularioOlvidePassword);
router.post('/olvide-password', customerController.resetPassword)
router.get('/olvide-password/:token', customerController.comprobarToken)
router.post('/olvide-password/:token', customerController.nuevoPassword)
router.get('/inicio', customerController.inicio)
router.get('/asistencia', customerController.asistencia)
router.get('/asistencia/:plantaA', customerController.asistencia2)
router.post('/asistencia', customerController.asistencia3)
router.get('/checklist', customerController.cheklist1)
router.post('/checklist', customerController.cheklist2)
router.get('/agregar-imagen', customerController.agregarImagen)
router.post('/agregar-imagen', customerController.agregarImagen2)
router.get('/controlDispositivos', customerController.controlDispositivos)
router.post('/controlDispositivos', customerController.controlDispositivos2)
router.get('/encuestaSatisfaccion', customerController.encuestaSatisfaccion)
router.post('/encuestaSatisfaccion', customerController.encuestaSatisfaccion2)
router.get('/directorio', customerController.paginaDirectorio);
router.get('/mantenimiento', customerController.paginaMantenimiento);
router.get('/solicitud', customerController.paginaSolicitud);
router.post('/solicitud', customerController.paginaSolicitud2);
// router.post('/solicitud/:cp', customerController.paginaSolicitud3);
router.get('/subirsolicitud/:id',customerController.subirSolicitud);
router.post('/subirsolicitud/:id', upload.single('pdfFile'),customerController.subirSolicitud2);
router.post('/enviar', customerController.paginaSolicitud2);
router.post('/uploader', customerController.uploads);
router.post('/enviarCorreo', customerController.enviarCorreo);
router.get('/juegos', customerController.juegos);
router.post('/juegos', customerController.juegos2);
router.get('/documentosControlados', customerController.documentosControlados);
router.get('/calidad/:documento', customerController.calidadD)

router.get('/api/:variable', customerController.api);


export default router;
