import express from "express";
import controladorBots from "../controllers/controladorBots.js";
import controlador from "../controllers/controladorBots.js";

const router = express.Router();

router.get('/bot', controladorBots.botReportes);

export default router;