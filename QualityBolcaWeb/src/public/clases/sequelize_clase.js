import { where } from "sequelize";


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
        catch(e){
            console.log(e.toString())
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
        catch(e){
            console.log(e.toString())
            return false;
        }
    }
    async actualizarDatos({id, datos}){
        try{
        let registro = await this.modelo.findByPk(id);
        if(!registro) return false;
        console.log('si encontro la actividad seleccionada')
        let actualizacion = await registro.update(datos,{
            where: {id},
            returning: true
        })
        if (actualizacion <= 0 ) return false;
        return true;}
        catch(ex){
            console.log(ex.toString())
            return false;
        }
    }

    async obtenerDatosPorCriterio({criterio}){
        let respuesta = await this.modelo.findAll({
            where: criterio
        })
        if (!respuesta) return ''
        return respuesta
    }
}

export default sequelizeClase;