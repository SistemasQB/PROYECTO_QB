import express from "express";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import session from "express-session";
// import uuidv4 from "uuid/v4";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PORT, SECRET_JWT_KEY } from "./src/config.js";
// import dbSQLS from "./src/config/dbSQLS.js";
import db from "./src/config/db.js";
import myConnection from "express-myconnection";
import mysql from "mysql2";
import cors from "cors";

import multer from "multer";

import Swal from 'sweetalert2'
// import mariadb from "mariadb";
import { default as customerRoutes } from "./src/routes/userRoutes.js";
import { default as adminRoutes } from "./src/routes/adminRoutes.js";
import { default as allRoutes } from "./src/routes/allRoutes.js";
import { default as sistemasRoutes } from "./src/routes/sistemasRoutes.js";
import { default as sorteoRoutes } from "./src/routes/sorteoRoutes.js";
import { default as calidadRoutes } from "./src/routes/calidadRoutes.js";
import { default as atraccionRoutes } from "./src/routes/atraccionRoutes.js";
import { default as capitalhumanoRoutes } from "./src/routes/capitalHumanoRoutes.js";
import { default as nominasRoutes } from "./src/routes/nominasRoutes.js";

import mimeTypes from "mime-types";
import fetch from 'node-fetch'

import urlencoded from "body-parser";
import nodeMailer from 'nodemailer';
import path from "path";

import { pipeline } from '@xenova/transformers';
import wavefile from 'wavefile';
import fs from 'fs';


const app = express();

app.use(cors());

// Configurar almacenamiento de archivos con Multer
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//Habilitar cookie parser

app.use( cookieParser() )

//Habilitar CSRF

app.use( csurf({cookie: true}))

// Middleware CSRF usando cookies
// export const csrfProtection = csrf({ cookie: true });



//conexion a la base de datos
try {
  await db.authenticate()
  db.sync()
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


app.use('/', customerRoutes);
app.use('/admin', adminRoutes);
app.use('/all', allRoutes);
app.use('/sistemas', sistemasRoutes);
app.use('/calidad', calidadRoutes);
app.use('/atraccion', atraccionRoutes);
app.use('/capitalhumano', capitalhumanoRoutes);
app.use('/sorteo', sorteoRoutes);
app.use('/nominas', nominasRoutes);





app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})

