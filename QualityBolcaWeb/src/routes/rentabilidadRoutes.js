import express from "express";
import rentabilidadController from "../controllers/controllerRentabilidad.js";
import validarAcceso from "../middleware/validacion-permisos/calidad/permisos.js";
import protegerRuta from "../middleware/protegetRuta.js";


const routerRentabilidad = express.Router();
routerRentabilidad.get('/controlProyectos', protegerRuta, validarAcceso({
    roles: ['administracion', 'rentabilidad'],
    permisos: ['analista', 'permitido', 'director de administracion'], 
    jerarquia: 4}), rentabilidadController.controlProyectos);

export default routerRentabilidad;