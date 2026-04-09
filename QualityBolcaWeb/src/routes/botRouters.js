import express from "express";
import controladorBots, { uploadPdf } from "../controllers/controladorBots.js";

const router = express.Router();

router.get('/bot', controladorBots.botReportes);
router.post('/bot/chat', controladorBots.botChat);
router.post('/bot/chat-with-pdf', uploadPdf.single('pdf'), controladorBots.botChatWithPdf);

export default router;