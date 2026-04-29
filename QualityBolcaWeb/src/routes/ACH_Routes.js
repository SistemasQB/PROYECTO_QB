import express from "express";
import controladorACH from '../controllers/ACH_Controller.js';
import protegetRuta from "../middleware/protegetRuta.js";
import { accesoACH, soloSolicitantes, soloAutorizadoresACH } from "../middleware/validacion-permisos/capitalhumano/permisos_ACH.js";

const router = express.Router();

// inicio del módulo
router.get('/inicio', protegetRuta, controladorACH.inicio);

// catálogos (accesible para ambos roles)
router.post('/catalogos', protegetRuta, accesoACH, controladorACH.catalogos);

// solicitud de empleo pública
router.get('/solicitudParcial', controladorACH.solicitudParcial);
router.post('/solicitud', controladorACH.guardarSolicitud);

// requisición de personal operativo
router.get('/requisicion-personal', protegetRuta, accesoACH, controladorACH.requisicionPersonalOperativo);
router.post('/requisicion-personal', protegetRuta, soloSolicitantes, controladorACH.guardarRequisicion);
router.put('/requisicion-personal/:id/autorizar', protegetRuta, soloAutorizadoresACH, controladorACH.autorizarRequisicion);
router.patch('/requisicion-personal/:id',          protegetRuta, soloAutorizadoresACH, controladorACH.editarRequisicion);

export default router;
