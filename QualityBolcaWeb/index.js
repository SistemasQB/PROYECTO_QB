import express from "express";
import csurf from "csurf";
import cookieParser from "cookie-parser";
// import uuidv4 from "uuid/v4";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PORT } from "./src/config.js";
import db from "./src/config/db.js";
import myConnection from "express-myconnection";
import mysql from "mysql2";
import cors from "cors";

// import multer from "multer";

import Swal from 'sweetalert2'
// import mariadb from "mariadb";
import { default as customerRoutes } from "./src/routes/userRoutes.js";
import { default as adminRoutes } from "./src/routes/adminRoutes.js";
import { default as allRoutes } from "./src/routes/allRoutes.js";
import { default as sistemasRoutes } from "./src/routes/sistemasRoutes.js";
import { default as calidadRoutes } from "./src/routes/calidadRoutes.js";
import { default as atraccionRoutes } from "./src/routes/atraccionRoutes.js";

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
// export const upload = multer({ dest: 'uploads2/'})

app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//Habilitar cookie parser

app.use( cookieParser() )

//Habilitar CSRF

app.use( csurf({cookie: true}))


//conexion a la base de datos
try {
  await db.authenticate()
  db.sync()
  console.log('Conexion Correcta a la base de datos');

}
catch (error) {
  console.log(error);
}


export const transporter = nodeMailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "mantenimiento@qualitybolca.net",
    pass: "Man.2024Nto",
  }
});


export function alerta( tipoA, mensaje) {
  console.log('Entro a la alerta');
  
  Swal.fire({
    title: "Good job!",
    text: "You clicked the button!",
    icon: "success"
  });
}

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




app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})
