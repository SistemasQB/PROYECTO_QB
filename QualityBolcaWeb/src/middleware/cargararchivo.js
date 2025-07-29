import multer from "multer";
import path from "path";
// const csurf = require('csurf');

import { generarId } from "../helpers/tokens.js";

const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {

        const guardarRuta = req.rawHeaders[7];
        // console.log(JSON.stringify(req));
        // console.log(req.ruta);
        

        cb(null, guardarRuta)
    },
    filename: function (req, file, cb) {
        cb(null, generarId() + path.extname(file.originalname))
    }
})

const upload3 = multer({ storage })

export default upload3