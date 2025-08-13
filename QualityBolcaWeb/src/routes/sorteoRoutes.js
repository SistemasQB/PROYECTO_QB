import express from "express";
import {default as sorteoController} from './../controllers/sorteoController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import upload from "../middleware/subirImagen.js";

const router = express.Router();

router.get('/kiosk',sorteoController.kiosk);
router.post('/kiosk',sorteoController.kiosk2);
router.get('/honda/etiquetado',sorteoController.etiquetado);
router.post('/honda/etiquetado',sorteoController.etiquetado2);
router.get('/cc1/vistatotal',sorteoController.vistatotal);
router.get('/cc1/checklist',sorteoController.checklist);
router.post('/cc1/checklist',sorteoController.checklist2);
router.get('/cc1/vistachecklist',sorteoController.vistachecklist);
router.get('/cc1/registromaterial',sorteoController.registromaterial);
router.get('/cc1/personaloperativo',sorteoController.personaloperativo);
router.post('/cc1/personaloperativo',sorteoController.personaloperativo2);
router.get('/cc1/cotizaciones',sorteoController.cotizaciones);
router.post('/cc1/cotizaciones',sorteoController.cotizaciones2);
router.get('/cc1/controldepiezas',sorteoController.controldepiezas);
router.post('/cc1/controldepiezas',sorteoController.controldepiezas2);
router.get('/cc1/secciones',sorteoController.secciones);
router.post('/cc1/secciones',sorteoController.secciones2);
router.get('/cc1/lote',sorteoController.lote);
router.post('/cc1/lote',sorteoController.lote2);


export default router;