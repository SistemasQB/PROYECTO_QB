import manejadorErrores from '../middleware/manejadorErrores.js';

let controlador = {}
controlador.inicio = (req, res) => {
    try{
        return res.render('admin/capitalhumano/inicioCapitalHumano.ejs')
    }catch(error){
        console.error('Error en controlador.inicio:', error);
        return manejadorErrores(res, 'Error al cargar la página de inicio de Capital Humano');
        
    }
}
export default controlador;