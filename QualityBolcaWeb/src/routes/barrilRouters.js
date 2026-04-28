import adminRouters from "./adminRoutes.js";
import calidadRouters from "./calidadRoutes.js";
import ACH_Routers from "./ACH_Routes.js";
import contabilidadRouters from "./contabilidadRoutes.js";
import infraestructuraRouters from "./infraestructuraRouter.js";
import nominasRouters from "./nominasRoutes.js";
import rentabilidadRouters from "./rentabilidadRoutes.js";
import servicioClienteRouters from "./servicioClienteRoutes.js";
import sistemasRouters from "./sistemasRoutes.js";
import sorteoRouters from "./sorteoRoutes.js";
import userRouters from "./userRoutes.js";
import routerGenerales from "./routerGenerales.js";
import capturacionRouters from "./capturacionRouter.js";    
import botRouter from "./botRouters.js";
import routerApis from "./routers_Apis.js";
import ventasRouters from "./ventasRoutes.js";



const routers = {
    adminRouters,
    ACH_Routers,    
    contabilidadRouters,
    infraestructuraRouters,
    nominasRouters,
    rentabilidadRouters,
    servicioClienteRouters,
    sorteoRouters,
    sistemasRouters,
    calidadRouters,
    userRouters,
    routerGenerales,
    capturacionRouters,
    botRouter,
    routerApis,
    ventasRouters
}

export default routers;
