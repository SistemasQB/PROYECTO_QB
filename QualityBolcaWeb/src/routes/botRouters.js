import express from "express";
import controladorBots from "../controllers/controladorBots.js";

const router = express.Router();

router.get('/bot', controladorBots.botReportes);
router.post('/bot/chat', controladorBots.botChat);

export default router;