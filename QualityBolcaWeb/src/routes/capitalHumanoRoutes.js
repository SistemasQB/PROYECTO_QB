import 'dotenv/config'
import express from "express";
import {default as capitalhumanoController} from './../controllers/capitalhumanoController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import upload from "../middleware/directoriofoto.js";


const router = express.Router();

router.get('/directorio',capitalhumanoController.directorioGCH);
router.get('/vacaciones',capitalhumanoController.vacaciones);
router.get('/altagch', protegetRuta, capitalhumanoController.altagch);
router.post('/altagch', protegetRuta, capitalhumanoController.altagch2);
router.get('/buzonquejas',capitalhumanoController.buzonquejas);
router.post('/buzonquejas',capitalhumanoController.buzonquejas2);
// router.post('/directorio',capitalhumanoController.directorioGCH2);
router.get('/subirfoto/:idempleado',capitalhumanoController.subirfoto);
router.post('/subirfoto/:idempleado', upload.single('directoriofoto'),capitalhumanoController.subirfoto2);
router.get('/asistencia',capitalhumanoController.asistencia);
router.get('/comedor',capitalhumanoController.comedor);
router.post('/comedor',capitalhumanoController.comedor2);

export default router;
