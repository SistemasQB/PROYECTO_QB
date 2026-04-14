import express from "express";
import {default as sorteoController} from './../controllers/sorteoController.js';
import protegerRuta from "../middleware/protegetRuta.js";
import miMulter from "../public/clases/multer.js";
import validarAcceso from "../middleware/validacion-permisos/calidad/permisos.js";

const multer = new miMulter('src/public/evidencias_sorteo');
const modelos = new miMulter('src/public/evidencias/modelos');
const router = express.Router();

//rutas de inicio
router.get('/inicio',protegerRuta,sorteoController.inicio);

// rutas de entrega Material almacen
router.get("/form-envio",protegerRuta,validarAcceso({roles: ['sorteo'], permisos: ['supervisor', 'supervisor regional de proyectos'], jerarquia: 5}),sorteoController.prueba)

//rutas de entrega de material cliente y visualizacion
router.get("/form-entrega", protegerRuta,validarAcceso({roles: ['sorteo'], permisos: ['supervisor', 'supervisor regional de proyectos'], jerarquia: 5}),sorteoController.entregaMaterial) //formulario de entrega de material
router.post("/envioMaterial", protegerRuta,validarAcceso({roles: ['sorteo'], permisos: ['supervisor', 'supervisor regional de proyectos'], jerarquia: 5}),multer.multiplesArchivos('imagenes', 3), sorteoController.envioMaterial) //ruta de envio
router.get("/admin-entrega-material", protegerRuta,validarAcceso({roles: ['sorteo'], permisos: ['supervisor', 'supervisor regional de proyectos'], jerarquia: 5}),sorteoController.adminEntregaMaterial) //gestion de los envios
  
//rutas de inventario de almacen
router.get("/admin-almacen",protegerRuta,validarAcceso({roles: ['sorteo'], permisos: ['supervisor', 'supervisor regional de proyectos'], jerarquia: 4}),sorteoController.adminAlmacen) //gestion de almacen
router.get("/ingreso/:id",protegerRuta, sorteoController.puntoEntrada) 

//rutas de output
router.get("/output",protegerRuta,validarAcceso({roles: ['sorteo'], permisos: ['supervisor', 'supervisor regional de proyectos'], jerarquia: 4}) ,sorteoController.output) //vista del output
router.post("/crudOutput",protegerRuta,validarAcceso({roles:['sorteo'], permisos:['supervisor regional de proyectos','supervisor'], jerarquia: 4}),sorteoController.crudOutput) //crud de output
router.get('/gestionOutput',protegerRuta, validarAcceso({roles:['sorteo', 'calidad'], permisos:['director de sorteo', 'analista', 'gerente'], jerarquia: 4}) ,sorteoController.dashBoardOutput)


//dashboard de horas 
router.get('/dashboard', protegerRuta,sorteoController.dashboard)



export default router;