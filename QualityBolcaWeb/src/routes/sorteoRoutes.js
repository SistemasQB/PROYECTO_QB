import express from "express";
import {default as sorteoController} from './../controllers/sorteoController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import upload from "../middleware/subirImagen.js";

const router = express.Router();

router.get('/kiosk',sorteoController.kiosk);
router.post('/kiosk',sorteoController.kiosk2);
router.get('/etiquetado',sorteoController.etiquetado);
router.post('/etiquetado',sorteoController.etiquetado2);
router.get('/cc1/vistatotal',sorteoController.vistatotal);
router.get('/cc1/checklist',sorteoController.checklist);
router.post('/cc1/checklist',sorteoController.checklist2);
router.get('/cc1/vistachecklist',sorteoController.vistachecklist);


export default router;