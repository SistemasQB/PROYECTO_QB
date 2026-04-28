import modeloDepartamentos from './modeloDepartamentos.js';
import modeloEscolaridades from './modeloEscolaridades.js';
import modeloinfonavitTiposDescuentos from './modeloInfonavitTiposDescuento.js';
import modeloMotivosBaja from './modeloMotivosBaja.js';
import modeloPlantas from './modeloPlantas.js';
import modeloPuestos from './modeloPuestos.js';
import modeloRegiones from './modeloRegiones.js';
import modeloTiposContratos from './modeloTiposContratacion.js';

export const Catalogos = {
    capitalHumano:{
        departamentos: modeloDepartamentos,
        escolaridades: modeloEscolaridades,
        infonavitTiposDescuentos: modeloinfonavitTiposDescuentos,
        motivosBaja: modeloMotivosBaja,
        plantas: modeloPlantas,
        puestos: modeloPuestos,
        regiones: modeloRegiones,
        tiposContratos: modeloTiposContratos
    },
    gastos: {
        xmls: null
    }
}

export const capitalHumano = Catalogos.capitalHumano;
export const gastos = Catalogos.gastos;
export default Catalogos;

