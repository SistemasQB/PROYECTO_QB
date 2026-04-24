import express from "express";
import controladorACH from '../controllers/capitalhumanoController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import validarAcceso from "../middleware/validacion-permisos/calidad/permisos.js";

const router = express.Router();

router.get('/inicio', protegetRuta, controladorACH.inicio);
router.post('/catalogos', protegetRuta, controladorACH.catalogos);

export default router;