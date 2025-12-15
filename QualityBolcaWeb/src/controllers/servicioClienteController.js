import sequelizeClase from "../public/clases/sequelize_clase.js";
import manejadorErrores from "../middleware/manejadorErrores.js";

const controllerServicioCliente = {}

controllerServicioCliente.formularioHorasCobro = (req, res) => {
    try {
        req.csrfToken
        return res.render("admin/servicioCliente/registroHorasCobro.ejs", {tok: req.csrfToken()});    
    } catch (ex) {
        return manejadorErrores(res, ex)    
    }

    
}

controllerServicioCliente.çrudHorasCobro = async(req, res) => {
    let {tipo} = req.body
    let campos = req.body
    delete campos._csrf
    delete campos.tipo
    
    switch (tipo){
        case "insert":

            break;
        case "update":
            break;
        case "delete":
            break;
    }
}

export default controllerServicioCliente;