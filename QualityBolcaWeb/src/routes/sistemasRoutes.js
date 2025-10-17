import express from "express";
import {default as adminController} from './../controllers/sistemasController.js';
import protegetRuta from "../middleware/protegetRuta.js";


const router = express.Router();
//ruta de inicio
router.get('/inicio', adminController.inicio);
router.get('/registroma',adminController.registroMA);
router.get('/addinventario',adminController.addinventario);
router.post('/addinventario',adminController.addinventario2);
router.get('/addvales',adminController.addvales);
router.post('/addvales',adminController.addvales2);
router.get('/tablainventario',adminController.tablainventario);
router.get('/api/:query2',adminController.api);
router.get('/registromantenimiento',adminController.registromantenimiento);
router.get('/programamantenimiento',adminController.programamantenimiento);
router.get('/listadopersonal',adminController.listadopersonal);
router.get('/listadosolicitudes',adminController.listadosolicitudes);
router.get('/mantenimientoautonomo',adminController.mantenimientoautonomo);



export default router;