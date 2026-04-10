import express from "express";
import controladorBots from "../controllers/controladorBots.js";
import protegerRuta from "../middleware/protegetRuta.js";

const router = express.Router();

router.get('/bot', protegerRuta, controladorBots.botReportes);

export default router;