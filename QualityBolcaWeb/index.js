import express from "express";
import rateLimit from "express-rate-limit";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";
import directivas from "./src/config/directivas.js";
import dbs from "./src/config/barril_dbs.js";
import cors from "cors";
import routers from "./src/routes/barrilRouters.js";
import dotenv from "dotenv";
// import miCron from "./src/public/clases/clase_cron.js";
import path from "path";
//configuracion del .env
dotenv.config({path: '.env'})

//limites en caso de que se agregue una API publica o un endpoint publico para preservar caidas del server
const limiterGlobal = rateLimit({
    windowMs: 1 * 60 * 1000,   // ventana de 1 minuto
    max: 100,                   // máximo 100 requests por IP por minuto
    standardHeaders: true,      // incluye info del límite en headers de respuesta
    legacyHeaders: false,
    message: { ok: false, msg: 'Demasiadas peticiones, intenta más tarde.' }
});
const limiterApiPublica = rateLimit({
    windowMs: 1 * 60 * 1000,   // ventana de 1 minuto
    max: 30,                    // máximo 30 requests por IP por minuto
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, msg: 'Límite de consultas alcanzado.' }
});

const app = express();
app.use(cors({
  credentials: true,
  origin: ['https://www.qualitybolca.net']   
}));

app.use(limiterGlobal); // ← aplica a TODO el servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configuración de Helmet según entorno
if (process.env.NODE_ENV === "production") {
  app.use(helmet({   contentSecurityPolicy: {
        directives: directivas
    }} )); // seguridad completa
} else {
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    originAgentCluster: false
  }));
}


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

//Habilitar cookie parser
app.use( cookieParser(process.env.JWT_SECRET) )

//conexion a la base de datos
try {
  await dbs.db.authenticate();
  dbs.db.sync();
  await dbs.dbCompras.authenticate();
  dbs.dbCompras.sync();
  await dbs.dbCalidad.authenticate();
  dbs.dbCalidad.sync();
  await dbs.dbSistemas.authenticate();
  dbs.dbSistemas.sync();
  await dbs.dbCapturacion.authenticate();
  dbs.dbCapturacion.sync();
  await dbs.dbSorteo.authenticate();
  dbs.dbSorteo.sync();
  console.log('Conexion Correcta a la base de datos');
}
catch (error) {
  console.log(error);
}

// Configura la sesión
app.use(session({
  secret: process.env.JWT_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // pon true si usas HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 Dia
  }
}));

app.use(express.static('./src/public'));

//Habilirar  EJS
app.set('views', path.join('\src', 'views'));
app.set('view engine', 'ejs');
const csrfProtection = csurf({ cookie: true });

  //declaracion de rutas
app.use('/', csrfProtection,routers.userRouters);
app.use('/admin',csrfProtection, routers.adminRouters);
app.use('/sistemas',csrfProtection, routers.sistemasRouters);
app.use('/calidad',csrfProtection, routers.calidadRouters);
app.use('/atraccion',csrfProtection, routers.atraccionRouters);
app.use('/capitalhumano',csrfProtection, routers.capitalHumanoRouters);
app.use('/sorteo',csrfProtection ,routers.sorteoRouters);
app.use('/nominas',csrfProtection, routers.nominasRouters);
app.use('/infraestructura', csrfProtection,routers.infraestructuraRouters);
app.use('/contabilidad',  csrfProtection,routers.contabilidadRouters);
app.use('/servicioCliente',csrfProtection,routers.servicioClienteRouters);
app.use('/rentabilidad',csrfProtection, routers.rentabilidadRouters);
app.use('/procedimientos', csrfProtection, routers.routerGenerales);
app.use('/capturacion', csrfProtection,routers.capturacionRouters);
app.use('/bots', csrfProtection, routers.botRouter);
app.use('/apis', routers.routerApis);
app.use((_, res) => {
  return res.render('admin/default/paginaNoEncontrada.ejs');
});

app.use(express.json());
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})


//cronos de ejecucion en tareas periodicas
// const cronos = new miCron(); 
// cronos.iniciarCron('prueba1', '* * * * * *', () => {console.log(`trabajo ejectuado 0 veces`)});


