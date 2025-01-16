import express from "express";
import {default as atraccionController} from './../controllers/atraccionController.js';

const router = express.Router();

router.get('/solicitudes', atraccionController.solicitudes);
// router.post('/subirCurso', allController.subirCurso2);




export default router;