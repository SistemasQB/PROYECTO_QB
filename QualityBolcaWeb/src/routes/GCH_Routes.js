import express from "express";
import {default as atraccionController} from './../controllers/atraccionController.js';
import protegetRuta from "../middleware/protegetRuta.js";

const router = express.Router();
router.get('/solicitudes', protegetRuta, atraccionController.inicio);

export default router;