import express from 'express'
import contabilidadController from '../controllers/contabilidadController.js';
import validarAcceso from '../middleware/validacion-permisos/calidad/permisos.js';


const routerContabilidad = express.Router()
//rutas de control de facturacion
routerContabilidad.get('/controlFacturacion', contabilidadController.controlFacturas)
routerContabilidad.get('/factura/:id', contabilidadController.consultarFactura)

export default routerContabilidad;