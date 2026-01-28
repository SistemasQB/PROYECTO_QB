import express from "express";
import rentabilidadController from "../controllers/controllerRentabilidad.js";

const routerRentabilidad = express.Router();
routerRentabilidad.get('/controlProyectos', rentabilidadController.controlProyectos);

export default routerRentabilidad;