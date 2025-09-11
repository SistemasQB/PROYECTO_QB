import multer from "multer";
import path from "path"
import fs from "fs"

class miMulter{
constructor(destino, limite, tiposPermitidos) { //, mimetypesPermitidos 
    this.destino = destino || 'evidencias';
    this.limite = limite || 5;
    this.tiposPermitidos = tiposPermitidos || /jpeg|jpg|png|xlsx|pdf|pptx|/;
    this.mimetypesPermitidos = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
]
    
    
    if(!fs.existsSync(this.destino)){
      fs.mkdirSync(this.destino, { recursive: true })
    }

    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.destino);
      },
      filename: (req, file, cb) => {
        const nombreOriginal = path.basename(file.originalname, path.extname(file.originalname));
        const extension = path.extname(file.originalname).toLowerCase();

        // Buscar archivos previos con el mismo nombre base y extensión

        // const archivosEnDestino = fs.readdirSync(this.destino);
        // for (const archivo of archivosEnDestino) {
        //   if (archivo.includes(nombreOriginal) && archivo.endsWith(extension)) {
        //     // Eliminar archivo previo
        //     fs.unlinkSync(path.join(this.destino, archivo));
        //   }
        // }
        const nombreUnico = nombreOriginal + " " +  Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, nombreUnico + path.extname(file.originalname));
      }
    });

    this.fileFilter = (req, file, cb) => {
      const extensionValida = this.tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
      const mimetypeValido = this.mimetypesPermitidos.includes(file.mimetype);

      if (extensionValida && mimetypeValido) {
        cb(null, true);
      } else {
        cb(new Error('Tipo de archivo no permitido.'), false);
      }

    };

    this.upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: this.limite
    });
  }

  // Middleware para archivo único
  archivoUnico(nombreCampo) {
    return this.upload.single(nombreCampo);
  }

  // Middleware para múltiples archivos en el mismo campo
  multiplesArchivos(nombreCampo, max = 5) {
    
    return this.upload.array(nombreCampo, max);
  }

  // Middleware para múltiples campos diferentes
  multiplesCampos(campos = []) {
    return this.upload.fields(campos);
  }
}

export default miMulter;
