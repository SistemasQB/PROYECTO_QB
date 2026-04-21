import protegerRuta from "./protegetRuta.js";
import manejadorErrores from "./manejadorErrores.js";
import validacion_apiKey from "./validacion_apiKey.js";
import rutasPublicas from "./rutasPublicas.js";
import middlewareAccesoArchivo from "./servidorArchivos.js";


const middlewares = {
    protegerRuta, 
    manejadorErrores,
    validacion_apiKey,
    rutasPublicas,
    middlewareAccesoArchivo
}
    

export default middlewares