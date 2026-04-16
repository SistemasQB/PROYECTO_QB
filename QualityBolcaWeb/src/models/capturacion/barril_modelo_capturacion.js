import Cotizacion from "../generales/cotizacion.js";
import Reporte from "./reporte.js";
import ReporteBody from "./reporteBody.js";

// Definimos las asociaciones
Cotizacion.hasMany(Reporte, {foreignKey: 'cotizacion_id'});
Reporte.belongsTo(Cotizacion, {foreignKey: 'cotizacion_id'});

Reporte.hasMany(ReporteBody, { foreignKey: 'reporte_id' });
ReporteBody.belongsTo(Reporte, { foreignKey: 'reporte_id' });

export {
    Cotizacion,
    Reporte,
    ReporteBody
};