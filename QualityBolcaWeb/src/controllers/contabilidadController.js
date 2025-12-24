import manejadorErrores from '../middleware/manejadorErrores.js';
import modelosFacturacion from '../models/contabilidad/barrilModelosContabilidad.js';
import claseSequelize from '../public/clases/sequelize_clase.js';

const contabilidadController = {};


contabilidadController.controlFacturas = async(req, res) => {
    try {
        let clase = new claseSequelize({modelo: modelosFacturacion.xmls_facturacion});
        let facturas = await  clase.obtenerDatosPorCriterio({criterio: {},atributos: ['id', 'fechaFactura', 'total', 'estatusPago','receptor']});
        return res.render('admin/contabilidad/controlFacturacion.ejs', {facturas: facturas, tok: req.csrfToken()});    
    } catch (error) {
        manejadorErrores(res, error)
    }
    
}

export default contabilidadController;