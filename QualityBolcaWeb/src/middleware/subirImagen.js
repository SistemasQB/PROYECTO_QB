import multer from "multer";
import path from "path";
import { generarId } from "../helpers/tokens.js";

console.log('middlerare subir imagen');


const imagenes = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './src/public/fotos/')
    },
    filename: function (req, file, cb) {
        cb(null, generarId() + path.extname(file.originalname))
    }
})


const upload = multer({ imagenes })
// upload.directoriofoto = multer({ fotos })

export default upload




// class subirImagen (){
//     let path = '/administracion/mispfs';

//     constructor(this.path? = null ? '': thispoth) { }

//     function enviodedatos(){
//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, './src/public/uploads/')
//         },
//         filename: function (req, file, cb) {
//             cb(null, generarId() + path.extname(file.originalname))
//         }
//     })
    
//     const upload = multer({ storage })
    
//     export default upload
// }


// }


//  let subirarchivo = new subirImagen();
//  subirImagen.enviodedatos(req.body.path)



    
    