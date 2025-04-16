import express from "express";
import {default as sorteoController} from './../controllers/sorteoController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import upload from "../middleware/subirImagen.js";

const router = express.Router();

router.get('/kiosk',sorteoController.kiosk);
router.post('/kiosk',sorteoController.kiosk2);
export default router;