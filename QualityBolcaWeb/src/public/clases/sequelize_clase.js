import { where } from "sequelize";
import Sequelize from "sequelize";

class sequelizeClase{

    constructor({modelo}){
        this.modelo = modelo
        if (!modelo) throw new Error('se requiere el modelo')
        
    }

    async insertar({datosInsertar}){
        try{
        let inserccion =  await this.modelo.create(datosInsertar);
        if (!inserccion) return false;
        return true;}
        catch(ex){
            console.log(`sucedio un error en la clase sequelize,error: ${ex}`)
            return false;
        }
    }
    async eliminar ({id}) {
        try{
        let dato = await this.modelo.findByPk(id);
        if(!dato) return false
        let elim = await dato.destroy({returning: true});
        if (!elim) return false
        return true}
        catch(ex){
            console.log(ex.toString())
            return false;
        }
    }
    async actualizarDatos({id, datos}){
        try{
        let registro = await this.modelo.findByPk(id);
        if(!registro) return false;
        let actualizacion = await registro.update(datos,{
            where: {id},
            returning: true,
        })
        if (actualizacion <= 0 ) return false;
        return true;}
        catch(ex){
            console.log(ex.toString())
            return false;
        }
    }

    async obtenerDatosPorCriterio({criterio, ordenamiento = null}){
        const opciones = {
            where: criterio
        }
        if (ordenamiento){
            opciones.order = ordenamiento
        }
        let respuesta = await this.modelo.findAll(opciones)
        
        if (!respuesta) return ''
        return respuesta
    }
    async obtener1Registro({criterio}){
        
    const opciones = {
            where: criterio
        }
    
        let respuesta = await this.modelo.findOne(opciones)
        if (!respuesta) return ''
        return respuesta
}
    async insertarquery({query}){
        return await Sequelize.query(query,{
            model: modelo,
            mapToModel: true
        })
    }
}



export default sequelizeClase;