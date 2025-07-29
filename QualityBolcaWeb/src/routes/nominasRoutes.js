import express from "express";
import {default as nominasController} from './../controllers/nominasController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import upload3 from "../middleware/cargararchivo.js";


const router = express.Router();

router.get('/subirsemanal' ,nominasController.subirsemanal);
router.post('/subirsemanal' , upload3.single('semanal'), nominasController.subirsemanal2);

export default router;