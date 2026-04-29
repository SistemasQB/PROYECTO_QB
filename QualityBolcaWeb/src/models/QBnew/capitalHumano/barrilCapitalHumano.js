// ── MÓDULOS ACH ──────────────────────────────────────────────
import RequisicionPersonal         from './modeloRequisicionPersonal.js'

// ── CATÁLOGOS ────────────────────────────────────────────────
import Puestos                     from '../catalogos/modeloPuestos.js'
import Departamentos               from '../catalogos/modeloDepartamentos.js'
import Regiones                    from '../catalogos/modeloRegiones.js'
import Plantas                     from '../catalogos/modeloPlantas.js'
import Escolaridades               from '../catalogos/modeloEscolaridades.js'
import TiposContratacion           from '../catalogos/modeloTiposContratacion.js'
import MotivosBaja                 from '../catalogos/modeloMotivosBaja.js'
import InfonavitTiposDescuento     from '../catalogos/modeloInfonavitTiposDescuento.js'

// ── Todos los modelos en un objeto ───────────────────────────
const modelosCapitalHumano = {
    Puestos, Departamentos, Regiones, Plantas,
    Escolaridades, TiposContratacion, MotivosBaja, InfonavitTiposDescuento,
    Requisiciones: RequisicionPersonal,
}

Object.values(modelosCapitalHumano).forEach(modelo => {
    if (typeof modelo.asociar === 'function') {
        modelo.asociar(modelosCapitalHumano)
    }
})

export default modelosCapitalHumano;
