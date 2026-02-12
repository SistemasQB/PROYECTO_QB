import express from "express";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import session from "express-session";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PORT, SECRET_JWT_KEY } from "./src/config.js";
import dbs from "./src/config/barril_dbs.js";
import cors from "cors";
import routers from "./src/routes/barrilRouters.js";
import miCron from "./src/public/clases/clase_cron.js";

import {
  Controlpiezas,
  Controlpiezas2
} from "./src/models/index.js";

import path from "path";


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//Habilitar cookie parser
app.use( cookieParser() )

//conexion a la base de datos
try {
  await dbs.db.authenticate()
  dbs.db.sync()
  await dbs.dbCompras.authenticate()
  dbs.dbCompras.sync()
  await dbs.dbCalidad.authenticate();
  dbs.dbCalidad.sync()
  await dbs.dbSistemas.authenticate()
  dbs.dbSistemas.sync()
  await dbs.dbSorteo.authenticate()
  dbs.dbSorteo.sync()
  console.log('Conexion Correcta a la base de datos');
}
catch (error) {
  console.log(error);
}

// Configura la sesión
app.use(session({
  secret: SECRET_JWT_KEY, // Cambia esto por una cadena única y segura
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // pon true si usas HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 Dia
  }
}));

// export default upload

app.use(express.static('./src/public'));

//Habilirar  EJS
app.set('views', path.join('\src', 'views'));
app.set('view engine', 'ejs');
const csrfProtection = csurf({ cookie: true });
app.post('/sorteo/cc1/controldepiezas',async (req, res) =>{

const {piezasOK, piezasNG, mesas} = req.body;

let fecha = new Date();
fecha.setHours(fecha.getHours() - 6);

try {
  await Controlpiezas.create({
    piezasOK,
    piezasNG,
    mesas,
    fecha: fecha
  });
  res.status(200).send({ msg: 'enviado con exito', ok: true });
} catch (error) {
  res.status(400).send({ msg: 'Error al enviar la peticion' + error, ok: false });
}
})

app.post('/sorteo/cc1/controldepiezas2',async (req, res) =>{


  const {piezasOK, piezasNG, mesas, inicio} = req.body;

  
  let fecha = new Date();
  fecha.setHours(fecha.getHours() - 6);
  
  // console.log(piezas, mesas, fecha);
  try {
    await Controlpiezas2.create({
      piezasOK,
      piezasNG,
      mesas,
      inicio,
      fecha
    });
    res.status(200).send({ msg: 'enviado con exito', ok: true });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: 'Error al enviar la peticion' + error, ok: false });
  }
  })

  //declaracion de rutas
app.use('/',csrfProtection, routers.userRouters);
app.use('/admin',csrfProtection, routers.adminRouters);
app.use('/all',csrfProtection, routers.routerAll);
app.use('/sistemas',csrfProtection, routers.sistemasRouters);
app.use('/calidad',csrfProtection, routers.calidadRouters);
app.use('/atraccion',csrfProtection, routers.atraccionRouters);
app.use('/capitalhumano',csrfProtection, routers.capitalHumanoRouters);
app.use('/sorteo',csrfProtection, routers.sorteoRouters);
app.use('/nominas',csrfProtection, routers.nominasRouters);
app.use('/infraestructura', csrfProtection,routers.infraestructuraRouters);
app.use('/contabilidad',  csrfProtection,routers.contabilidadRouters);
app.use('/servicioCliente',  csrfProtection,routers.servicioClienteRouters);
app.use('/rentabilidad',csrfProtection, routers.rentabilidadRouters);
app.use((_, res) => {
  return res.render('admin/default/paginaNoEncontrada.ejs');
});

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})


//cronos de ejecucion en tareas periodicas
// const cronos = new miCron(); 
// cronos.iniciarCron('prueba1', '* * * * * *', () => {console.log(`trabajo ejectuado 0 veces`)});


