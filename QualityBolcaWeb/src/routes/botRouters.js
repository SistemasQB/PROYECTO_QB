import express from "express";
import controladorBots, { uploadPdf } from "../controllers/controladorBots.js";
import protegetRuta from "../middleware/protegetRuta.js";

const router = express.Router();

router.get('/bot', controladorBots.botReportes);
router.post('/bot/chat', controladorBots.botChat);
router.post('/bot/chat-with-pdf', uploadPdf.single('pdf'), controladorBots.botChatWithPdf);

router.get('/reportesDiarios', controladorBots.reportesDiarios);
router.get('/reportesFiltrados', protegetRuta, controladorBots.reportesFiltrados);
router.get('/reportesFiltradosPorParametros', protegetRuta, controladorBots.reportesFiltradosPorParametros);

export default router;