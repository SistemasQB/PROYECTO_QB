import express from "express";
import {default as atraccionController} from './../controllers/atraccionController.js';
import protegetRuta from "../middleware/protegetRuta.js";

const router = express.Router();

router.get('/solicitudes', protegetRuta, atraccionController.solicitudes);
router.post('/solicitudes', protegetRuta, atraccionController.solicitudes2);
// router.post('/subirCurso', allController.subirCurso2);




export default router;