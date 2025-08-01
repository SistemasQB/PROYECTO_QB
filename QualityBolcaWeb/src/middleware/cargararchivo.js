import multer from "multer";
import path from "path";
import fsPromises from 'fs/promises';
import fs from 'fs';
// const csurf = require('csurf');

import { generarId } from "../helpers/tokens.js";

let guardarRuta;

// const carpetaObjetivo = './src/public/semanal/';

// fs.readdir(carpetaObjetivo, (err, archivos) => {
//   if (err) throw err;

//   archivos.forEach((archivo) => {
//     const rutaCompleta = path.join(carpetaObjetivo, archivo);
//     fs.rm(rutaCompleta, { recursive: true, force: true }, (err) => {
//       if (err) console.error(`Error al eliminar ${rutaCompleta}:`, err);
//       else console.log(`${rutaCompleta} eliminado.`);
//     });
//   });
// });


const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        guardarRuta = req.rawHeaders[7];
        // console.log(JSON.stringify(req));
        // console.log(req.ruta);
        

        cb(null, guardarRuta)
    },
    filename: function (req, file, cb) {
        if(guardarRuta == './src/public/semanal/'){
            cb(null, 'semanal' + path.extname(file.originalname))
        }else{
            cb(null, generarId() + path.extname(file.originalname))
        }
    }
})

const upload3 = multer({ storage })

export default upload3