import express from "express";
import controladorACH from '../controllers/capitalhumanoController.js';
import protegetRuta from "../middleware/protegetRuta.js";
import validarAcceso from "../middleware/validacion-permisos/calidad/permisos.js";

const router = express.Router();
//pagina de  iniccio del modulo
router.get('/inicio', protegetRuta, controladorACH.inicio);

//ruta de catalogos
router.post('/catalogos', protegetRuta, controladorACH.catalogos);

//ruta de solicitud
router.get('/solicitudParcial', controladorACH.solicitudParcial);

export default router;