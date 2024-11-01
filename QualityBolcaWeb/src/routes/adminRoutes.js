import express from "express";
import {default as adminController} from './../controllers/adminController.js';

const router = express.Router();

router.get('/inicio', adminController.inicio);
router.get('/enviarfoto', adminController.enviar);
router.get('/requisicion', adminController.requisicion);
router.post('/requisicion', adminController.requisicion2);
router.get('/valeSalida', adminController.valeSalida);
router.get('/voz', adminController.voz);
router.get('/crear', adminController.crear);



export default router;