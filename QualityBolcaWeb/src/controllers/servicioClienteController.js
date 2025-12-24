import sequelizeClase from "../public/clases/sequelize_clase.js";
import manejadorErrores from "../middleware/manejadorErrores.js";
import barrilModelosServicioCliente from "../models/servicioCliente/barrilModelosServicioCliente.js";
import modelosInfraestructura from "../models/infraestructura/barril_modelo_compras.js";
import modelosGenerales from "../models/generales/barrilModelosGenerales.js";
import { Op } from "sequelize";

const controllerServicioCliente = {}

//formulario de horas cobro servicio al cliente
controllerServicioCliente.formularioHorasCobro = async(req, res) => {
    try {
        let clase = new sequelizeClase({modelo:modelosInfraestructura.modelo_plantas_gastos})
        let plantas = await clase.obtenerDatosPorCriterio({criterio: {id: {[Op.gt]: 0}},atributos: ['planta']})
        return res.render("admin/servicioCliente/registroHorasCobro.ejs", {tok: req.csrfToken(), plantas: plantas});    
    } catch (ex) {
        return manejadorErrores(res, ex)    
    }

    
}

controllerServicioCliente.crudHorasCobro = async(req, res) => {
    let {tipo, id} = req.body
    let campos = req.body
    delete campos._csrf
    delete campos.tipo
    delete campos.id
    let clase = new sequelizeClase({modelo: modelosGenerales.modelonom10001})
    let  datosUsuario = await clase.obtener1Registro({criterio: {codigoempleado: req.usuario.codigoempleado}})
    clase =new sequelizeClase({modelo: barrilModelosServicioCliente.modelo_registroHorasCobro})
    switch (tipo){
        case "insert":
            campos.cotizadora = datosUsuario.nombrelargo
            let respuesta = await clase.insertar({datosInsertar: campos})
            if (!respuesta) return res.json({ok: false, msg: 'no se pudo ingresar la informacion'})
            return res.json({ok: respuesta, msg: 'informacion enviada exitosamente'})
        case "update":
            let actualizado = await clase.actualizarDatos({id: id, datos: campos})
            if (!actualizado) return res.json({ok: false, msg: 'no se pudo actualizar la informacion'})
            return res.json({ok: actualizado, msg: 'informacion actualizada exitosamente'})
        case "delete":
            let eliminado = await clase.eliminar({id: id})
            if (!eliminado) return res.json({ok: false, msg: 'no se pudo eliminar la informacion'})
            return res.json({ok: eliminado, msg: 'informacion eliminada exitosamente'})
    }
}

export default controllerServicioCliente;