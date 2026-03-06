import multer from "multer";
import path from "path";
import { generarId } from "../helpers/tokens.js";

const imagenes = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './src/public/fotos/')
    },
    filename: function (req, file, cb) {
        cb(null, generarId() + path.extname(file.originalname))
    }
})

const upload = multer({ imagenes })

export default upload


    
    