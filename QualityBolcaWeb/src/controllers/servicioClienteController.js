
const controllerServicioCliente = {}

controllerServicioCliente.formularioHorasCobro = (req, res) => {
    try {
        return res.render("admin/servicioCliente/registroHorasCobro.ejs");    
    } catch (error) {
        return res.send()    
    }

    
}

export default controllerServicioCliente;