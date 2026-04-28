import express from "express";
import controladorACH from '../controllers/ACH_Controller.js';
import protegetRuta from "../middleware/protegetRuta.js";
import validarAcceso from "../middleware/validacion-permisos/calidad/permisos.js";

const router = express.Router();

// página de inicio del módulo
router.get('/inicio', protegetRuta, controladorACH.inicio);

// ruta de catálogos
router.post('/catalogos', protegetRuta, controladorACH.catalogos);

// vista de solicitud parcial
router.get('/solicitudParcial', controladorACH.solicitudParcial);
router.post('/solicitud', controladorACH.guardarSolicitud);

// requisición de personal operativo
router.get('/requisicion-personal', protegetRuta, controladorACH.requisicionPersonalOperativo);

export default router;
