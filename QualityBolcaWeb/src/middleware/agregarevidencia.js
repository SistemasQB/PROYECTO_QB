import multer from "multer";
import path from "path";
import { generarId } from "../helpers/tokens.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/evidencias/')
    },
    filename: function (req, file, cb) {
        cb(null, generarId() + path.extname(file.originalname))
    }
})

const upload4 = multer({ storage })

export default upload4