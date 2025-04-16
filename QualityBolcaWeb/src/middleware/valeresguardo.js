import multer from "multer";
import path from "path";
import { generarId } from "../helpers/tokens.js";


// console.log('entrando al middleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
            cb(null, './src/public/firmas/')
    },
    filename: function (req, file, cb) {
        // console.log(file);
        cb(null, generarId() + path.extname(file.originalname))
    }
})


const upload2 = multer({ storage })
// upload.directoriofoto = multer({ fotos })

export default upload2
