import express from "express";
import {default as sorteoController} from './../controllers/sorteoController.js';
import protegerRuta from "../middleware/protegetRuta.js";
import miMulter from "../public/clases/multer.js";


const multer = new miMulter('src/public/evidencias_sorteo');
const router = express.Router();

router.get('/kiosk',sorteoController.kiosk);
router.post('/kiosk',sorteoController.kiosk2);
router.get('/honda/etiquetado',sorteoController.etiquetado);
router.post('/honda/etiquetado',sorteoController.etiquetado2);
router.get('/cc1/vistatotal',sorteoController.vistatotal);
router.get('/cc1/checklist',sorteoController.checklist);
router.post('/cc1/checklist',sorteoController.checklist2);
router.get('/cc1/vistachecklist',sorteoController.vistachecklist);
router.get('/cc1/registromaterial',sorteoController.registromaterial);
router.get('/cc1/personaloperativo',sorteoController.personaloperativo);
router.post('/cc1/personaloperativo',sorteoController.personaloperativo2);
router.get('/cc1/cotizaciones',sorteoController.cotizaciones);
router.post('/cc1/cotizaciones',sorteoController.cotizaciones2);
router.get('/cc1/controldepiezas',sorteoController.controldepiezas);
router.post('/cc1/controldepiezas',sorteoController.controldepiezas2);
router.get('/cc1/secciones',sorteoController.secciones);
router.post('/cc1/secciones',sorteoController.secciones2);
router.get('/cc1/lote',sorteoController.lote);
router.post('/cc1/lote',sorteoController.lote2);

//rutas de inicio
router.get('/inicio',protegerRuta,sorteoController.inicio);


// rutas de entrega Material almacen
router.get("/form-envio",sorteoController.prueba)
router.get("/embarques/:cliente", sorteoController.vistaCliente)

//rutas de entrega de material cliente y visualizacion
router.get("/form-entrega",sorteoController.entregaMaterial) //formulario de entrega de material
router.post("/envioMaterial", multer.multiplesArchivos('imagenes', 3), sorteoController.envioMaterial) //ruta de envio
router.get("/admin-entrega-material",sorteoController.adminEntregaMaterial) //gestion de los envios
  

//rutas de inventario de almacen
router.get("/admin-almacen",sorteoController.adminAlmacen) //gestion de almacen
router.get("/ingreso/:id",sorteoController.puntoEntrada) 

//rutas de output
router.get("/output",protegerRuta,sorteoController.output) //vista del output
router.post("/crudOutput",protegerRuta,sorteoController.crudOutput) //crud de output


export default router;