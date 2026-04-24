import sequelizeClase from "../public/clases/sequelize_clase.js";
import db from "../config/db.js";
import manejadorErrores from "../middleware/manejadorErrores.js";

const ventasController = {};

ventasController.dashboard = async (req, res) => {
    try {
        res.render('admin/ventas/dashboard.ejs');
    } catch (error) {
        manejadorErrores(res,error);
    }
}

ventasController.clientes = async (req, res) => {
    try {
        res.render('admin/ventas/clientes.ejs');
    } catch (error) {
        manejadorErrores(res,error);
    }
}

ventasController.agendaVentas = async (req, res) => {
    try {
        res.render('admin/ventas/agendaVentas.ejs');
    } catch (error) {
        manejadorErrores(res,error);
    }
}

ventasController.seguimiento = async (req, res) => {
    try {
        res.render('admin/ventas/seguimiento.ejs');
    } catch (error) {
        manejadorErrores(res,error);
    }
}

ventasController.calendario = async (req, res) => {
    try {
        res.render('admin/ventas/calendario.ejs');
    } catch (error) {
        manejadorErrores(res,error);
    }
}

export default ventasController;