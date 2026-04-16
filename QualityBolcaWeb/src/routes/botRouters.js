import express from "express";
import controladorBots, { uploadPdf } from "../controllers/controladorBots.js";

const router = express.Router();

router.get('/bot', controladorBots.botReportes);
router.post('/chat', controladorBots.botChat);
router.post('/chat-with-pdf', uploadPdf.single('pdf'), controladorBots.botChatWithPdf);
router.post('/normalize', controladorBots.normalizarCampo);

export default router;