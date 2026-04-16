import express from "express";
import controladorACH from '../controllers/capitalhumanoController.js';
import protegetRuta from "../middleware/protegetRuta.js";

const router = express.Router();

router.get('/solicitudes', protegetRuta, controladorACH.inicio);

export default router;