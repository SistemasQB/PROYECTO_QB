import express from "express";
import {default as nominasController} from './../controllers/nominasController.js';
import protegetRuta from "../middleware/protegetRuta.js";



const router = express.Router();

router.get('/solicitudes', protegetRuta, nominasController.inicio);


export default router;