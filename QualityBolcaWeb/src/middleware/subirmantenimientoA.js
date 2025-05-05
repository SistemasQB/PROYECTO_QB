import multer from "multer";
import path from "path";
import { generarId } from "../helpers/tokens.js";

console.log('se entro al midedleware de mantenimientoA');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/mantenimientoA/')
    },
    filename: function (req, file, cb) {
        cb(null, generarId() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

export default upload