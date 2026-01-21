import sequelizeClase from "../clases/sequelize_clase";
import modelosFacturacion from "../models/contabilidad/barrilModelosContabilidad";

async function validarEstatusPago(){
    let clase = new sequelizeClase({modelo:modelosFacturacion.xmls_facturacion});
    let criterios = {
        estatus : 'PENDIENTE'
    }
    const datos = await clase.obtenerDatosPorCriterio({criterio:criterios});
    let facturas = datos.map((factura) => {
        if(new Date( factura.fechaPago)> new Date(factura.fechaVencimiento)){
            return `update estatus = 'VENCIDA' where id = ${factura.id}`    
        }
        
    }).tolist()

}

// class miFactura{
//     constructor(
//         id,
//         cliente
//     ){
//         this.id = id,
//         this.cliente = cliente
//     }

//     jsonaEntidad(data){
//         return new miFactura(
//             data.id,
//             data.cliente
//         )
//     }

// }

export default validarEstatusPago;