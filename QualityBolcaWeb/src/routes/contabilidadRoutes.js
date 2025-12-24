import express from 'express'
import contabilidadController from '../controllers/contabilidadController.js';


const routerContabilidad = express.Router()

routerContabilidad.get('/controlFacturacion', contabilidadController.controlFacturas)

export default routerContabilidad;