import express from "express";
import capturacionController from "../controllers/capturacionController.js";
import protegerRuta from "../middleware/protegetRuta.js";   

const routerCapturacion = express.Router();

routerCapturacion.get('/listado', protegerRuta, capturacionController.listado); //listado de capturacion
routerCapturacion.get('/permisosCapturacion', protegerRuta, capturacionController.controlRegiones);//permisos de capturacion
routerCapturacion.post('/crudPermisosCaptura', protegerRuta, capturacionController.crudPermisos);//permisos de capturacion

export default routerCapturacion;