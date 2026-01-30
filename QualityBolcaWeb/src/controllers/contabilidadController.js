import { Op } from 'sequelize';
import manejadorErrores from '../middleware/manejadorErrores.js';


import modelosFacturacion from '../models/contabilidad/barrilModelosContabilidad.js';
import claseSequelize from '../public/clases/sequelize_clase.js';

const contabilidadController = {};


contabilidadController.controlFacturas = async(req, res) => {
    try {
        let clase = new claseSequelize({modelo: modelosFacturacion.xmls_facturacion});
        let facturas = await  clase.obtenerDatosPorCriterio({criterio: {
            estatusPago: {[Op.in]:['PENDIENTE', 'VENCIDA']},
            formaPago:{[Op.in]: ['PUE', 'PPD']}
    },atributos: ['id', 'uuid','receptor','fechaFactura', 'total', 'estatusPago','receptor','pago', 'descripcion', 'datosEmision', 'fechaVencimiento', 'moneda', 'conversion']});
        return res.render('admin/contabilidad/controlFacturacion.ejs', {facturas: facturas, tok: req.csrfToken()});    
    } catch (error) {
        manejadorErrores(res, error)
    }
    
}
contabilidadController.consultarFactura = async(req, res) => {
    try {
        let {id} = req.params
        let clase = new claseSequelize({modelo: modelosFacturacion.xmls_facturacion});
        let factura = await  clase.obtener1Registro({criterio: {id: id}})
        if(!factura)()=> res.json({msg: false, error: 'no se encontro la factura'})
        return res.render('admin/contabilidad/consultarFactura.ejs', {factura: factura, tok: req.csrfToken()});    
    } catch (error) {
        manejadorErrores(res, error)
    }
}

contabilidadController.reportesFacturacion = async(req, res) => {
    try {
        return res.render('admin/contabilidad/reportesFacturacion.ejs', {tok: req.csrfToken()});
    } catch (error) {
        
    }
}
export default contabilidadController;