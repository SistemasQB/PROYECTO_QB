import { Op } from 'sequelize';
import manejadorErrores from '../middleware/manejadorErrores.js';
import modelosFacturacion from '../models/contabilidad/barrilModelosContabilidad.js';
import claseSequelize from '../public/clases/sequelize_clase.js';

const contabilidadController = {};


contabilidadController.controlFacturas = async(req, res) => {
    try {
        let clase = new claseSequelize({modelo: modelosFacturacion.xmls_facturacion});
        let facturas = await  clase.obtenerDatosPorCriterio({criterio: {
            estatusPago: 'PENDIENTE',
            formaPago:{[Op.in]: ['PUE', 'PPD']}
    },atributos: ['id', 'uuid','receptor','fechaFactura', 'total', 'estatusPago','receptor','pago', 'descripcion', 'datosEmision', 'fechaVencimiento']});
        return res.render('admin/contabilidad/controlFacturacion.ejs', {facturas: facturas, tok: req.csrfToken()});    
    } catch (error) {
        manejadorErrores(res, error)
    }
    
}

export default contabilidadController;