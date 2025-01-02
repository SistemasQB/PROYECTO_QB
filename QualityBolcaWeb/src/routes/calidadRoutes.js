import express from "express";
import {default as calidadController} from './../controllers/calidadController.js';
import protegetRuta from "../middleware/protegetRuta.js";

const router = express.Router();

router.get('/verificacion5s' ,calidadController.verificacion5s);
router.post('/verificacion5s' ,calidadController.verificacion5s2);


export default router;