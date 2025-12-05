

const contabilidadController = {};


contabilidadController.controlFacturas = (req, res) => {
    return res.render('admin/contabilidad/controlFacturacion.ejs');
}

export default contabilidadController;