import multer from "multer";
import path from "path";
import { generarId } from "../helpers/tokens.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/analisis/')
    },
    filename: function (req, file, cb) {
        cb(null, generarId() + path.extname(file.originalname))
    }
})

const upload3 = multer({ storage })

export default upload3