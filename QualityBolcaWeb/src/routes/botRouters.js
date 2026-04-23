import express from "express";

import controladorBots, { uploadPdf } from "../controllers/controladorBots.js";
import protegetRuta from "../middleware/protegetRuta.js";

const router = express.Router();

router.get('/bot', controladorBots.botReportes);
router.post('/bot/chat', controladorBots.botChat);
router.post('/bot/chat-with-pdf', uploadPdf.single('pdf'), controladorBots.botChatWithPdf);
router.post('/bot/normalize', controladorBots.normalizarCampo);

router.get('/reportesDiarios', controladorBots.reportesDiarios);
router.get('/reportesSupervisores', protegetRuta, controladorBots.reportesSupervisores);
router.get('/reportesFiltrados', protegetRuta, controladorBots.reportesFiltrados);
router.get('/reportesFiltradosPorParametros', protegetRuta, controladorBots.reportesFiltradosPorParametros); //ruta de filtros por parametros
router.post('/firmarReporte', protegetRuta, controladorBots.firmarReporte); //ruta para firmar y cambiar estatus del reporte a signed
router.post('/publicarReporte', protegetRuta, controladorBots.publicarReporte); //ruta para publicar el reporte firmado, cambia estatus a published

// Módulo supervisor
router.get('/supervisor/bandeja', protegetRuta, controladorBots.bandejaSupervisor);
router.get('/supervisor/bandeja/data', protegetRuta, controladorBots.bandejaSupervisorData);
router.get('/supervisor/detalle/:id', protegetRuta, controladorBots.detalleReporte);
router.get('/supervisor/historial', protegetRuta, controladorBots.historialPublicados);
router.get('/supervisor/publicado/:id', protegetRuta, controladorBots.detallePublicado);

export default router;