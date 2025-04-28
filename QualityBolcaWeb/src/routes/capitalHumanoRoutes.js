import 'dotenv/config'
import express from "express";
import {default as capitalhumanoController} from './../controllers/capitalhumanoController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import upload from "../middleware/directoriofoto.js";


const router = express.Router();

router.get('/directorio',capitalhumanoController.directorioGCH);
router.get('/vacaciones',capitalhumanoController.vacaciones);
router.get('/altagch',capitalhumanoController.altagch);
router.get('/buzonquejas',capitalhumanoController.buzonquejas);
router.post('/buzonquejas',capitalhumanoController.buzonquejas2);
// router.post('/directorio',capitalhumanoController.directorioGCH2);
router.get('/subirfoto/:idempleado',capitalhumanoController.subirfoto);
router.post('/subirfoto/:idempleado', upload.single('directoriofoto'),capitalhumanoController.subirfoto2);

export default router;
