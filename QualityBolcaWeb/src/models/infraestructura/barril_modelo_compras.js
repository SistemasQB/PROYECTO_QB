import modeloOrdenCompra from "./modelo_orden_compra.js"
import modeloProveedoresOrdenesCompra from "./modelo_proveedores_ordenes_compra.js";
import modeloUnidadesLogistica from "./modelo_unidades_logistica.js";
import modeloCheckListVehicular from "./modelo_check_list_vehicular.js";
import modeloComprasInventario from "./modeloComprasInventario.js";
import modelo_plantas_gastos from "./modelo_Plantas.js";
import modelo_pedido_insumos from "./modelo_pedido_insumos.js";
import modelo_requisiciones from "./modelo_requisiciones.js";
    const modelosInfraestructura = {
        modeloOrdenCompra,
        modeloProveedoresOrdenesCompra,
        modeloUnidadesLogistica,
        modeloCheckListVehicular,
        modeloComprasInventario,
        modelo_plantas_gastos,
        modelo_pedido_insumos,
        modelo_requisiciones
    }
    export default modelosInfraestructura;