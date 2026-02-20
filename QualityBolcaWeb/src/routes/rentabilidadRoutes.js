import express from "express";
import rentabilidadController from "../controllers/controllerRentabilidad.js";
import validarAcceso from "../middleware/validacion-permisos/calidad/permisos.js";
import protegerRuta from "../middleware/protegetRuta.js";
import manejadorErrores from "../middleware/manejadorErrores.js";

const routerRentabilidad = express.Router();
routerRentabilidad.get('/controlProyectos', rentabilidadController.controlProyectos);

export default routerRentabilidad;