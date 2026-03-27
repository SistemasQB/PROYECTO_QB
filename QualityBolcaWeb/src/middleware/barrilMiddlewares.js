import protegerRuta from "./protegetRuta.js";
import manejadorErrores from "./manejadorErrores.js";
import validacion_apiKey from "./validacion_apiKey.js";


const middlewares = {
    protegerRuta, 
    manejadorErrores,
    validacion_apiKey,
}
    

export default middlewares