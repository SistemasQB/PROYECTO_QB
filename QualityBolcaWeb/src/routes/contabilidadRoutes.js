import express from 'express'
import contabilidadController from '../controllers/contabilidadController.js';
import validarAcceso from '../middleware/validacion-permisos/calidad/permisos.js';
import protegerRutas from '../middleware/protegetRuta.js';


const routerContabilidad = express.Router()
//rutas de control de facturacion
routerContabilidad.get('/controlFacturacion', protegerRutas,contabilidadController.controlFacturas)
routerContabilidad.get('/factura/:id', protegerRutas,contabilidadController.consultarFactura)
routerContabilidad.get('/reportesFacturacion', protegerRutas,contabilidadController.reportesFacturacion)

export default routerContabilidad;