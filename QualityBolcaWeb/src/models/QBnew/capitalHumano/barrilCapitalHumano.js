// ── CATÁLOGOS ────────────────────────────────────────────────
import Puestos                     from './catalogos/modeloPuestos.js'
import Departamentos               from './catalogos/modeloDepartamentos.js'
import Regiones                    from './catalogos/modeloRegiones.js'
import Plantas                     from './catalogos/modeloPlantas.js'
import Escolaridades               from './catalogos/modeloEscolaridades.js'
import TiposContratacion           from './catalogos/modeloTiposContratacion.js'
import MotivosBaja                 from './catalogos/modeloMotivosBaja.js'
import InfonavitTiposDescuento     from './catalogos/modeloInfonavitTiposDescuento.js'

// ── EMPLEADO ─────────────────────────────────────────────────
import Empleados                   from './empleado/modeloEmpleados.js'
import EmpleadosContacto           from './empleado/modeloEmpleadosContacto.js'
import EmpleadosContactoEmergencia from './empleado/modeloEmpleadosContactoEmergencia.js'

// ── LABORAL ──────────────────────────────────────────────────
import EmpleadosPosicion           from './laboral/modeloEmpleadosPosicion.js'
import HistorialEmpleo             from './laboral/modeloHistorialEmpleo.js'

// ── DOCUMENTOS Y BENEFICIOS ──────────────────────────────────
import EmpleadosDocumentos         from './documentos/modeloEmpleadosDocumentos.js'
import EmpleadosBeneficios         from './documentos/modeloEmpleadosBeneficios.js'

// ── INFONAVIT ────────────────────────────────────────────────
import InfonavitCreditos           from './infonavit/modeloInfonavitCreditos.js'
import InfonavitPagosBimestrales   from './infonavit/modeloInfonavitPagosBimestrales.js'

// ── EXTRAS ───────────────────────────────────────────────────
import EmpleadosReclutamiento      from './extras/modeloEmpleadosReclutamiento.js'
import Eventos                     from './extras/modeloEventos.js'
import EmpleadosEventos            from './extras/modeloEmpleadosEventos.js'
import Cursos                      from './extras/modeloCursos.js'
import EmpleadosCursos             from './extras/modeloEmpleadosCursos.js'

// ── Todos los modelos en un objeto ───────────────────────────
const modelosCapitalHumano = {
    Puestos, Departamentos, Regiones, Plantas,
    Escolaridades, TiposContratacion, MotivosBaja, InfonavitTiposDescuento,
    Empleados, EmpleadosContacto, EmpleadosContactoEmergencia,
    EmpleadosPosicion, HistorialEmpleo,
    EmpleadosDocumentos, EmpleadosBeneficios,
    InfonavitCreditos, InfonavitPagosBimestrales,
    EmpleadosReclutamiento, Eventos, EmpleadosEventos,
    Cursos, EmpleadosCursos
}

// ── Activa el método asociar() de cada modelo que lo tenga ──
// En este punto TODOS los modelos ya cargaron — sin dependencias circulares.
// Para agregar una nueva relación: solo toca el modelo correspondiente.
// Este archivo NO necesita modificarse al agregar relaciones.
Object.values(modelosCapitalHumano).forEach(modelo => {
    if (typeof modelo.asociar === 'function') {
        modelo.asociar(modelosCapitalHumano)
    }
})

export default modelosCapitalHumano
