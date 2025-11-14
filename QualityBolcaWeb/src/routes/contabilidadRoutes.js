import express from 'express'
import contabilidadController from '../controllers/contabilidadController';

const routerContabilidad = express.Router()



routerContabilidad.get('/controlFacturacion', contabilidadController.controlFacturas)

export default routerContabilidad;