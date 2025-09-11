import nodemailer from "../../clases/nodemailer.js";
import sequelizeClase from "../../clases/sequelize_clase.js";
import modeloBitacora from "../../../models/calidad/bitacoraActividades.js";
import { Op } from "sequelize";
import modeloComunicacion from "../../../models/comunicacion.js";
import Correo from "../../clases/entidades/correo.js";
import Usuario from "../../../models/Usuario.js";
import modeloDirectorioCalidad from "../../../models/calidad/directorioPersonal.js";
async function recordatorioActividades(){
    try{
        let clase = new sequelizeClase({modelo:modeloBitacora});
        let criterio = {[Op.and]: [
        {estatus: {[Op.notLike]:'%Completada%'}},
    ]}
    let orden = [['numeroEmpleado','DESC'], ['estatus', 'ASC']]
    let pendientes = await clase.obtenerDatosPorCriterio({criterio, orden})
    
    clase = new sequelizeClase({modelo: modeloDirectorioCalidad})
    orden = [['id', 'ASC']]
    criterio = {
        id: {
            [Op.ne]: ''
        }
    }
    let contactos = await clase.obtenerDatosPorCriterio({criterio})
    
    let actividades = await maperActividades(pendientes, contactos)
    console.log(actividades);
    let nod = new nodemailer
    nod.enviarCorreosMasivos({listaCorreos: actividades})
    }catch(e){
        console.log(`ocurrio un error: ${e}`)
    }
}

async function maperActividades(pendientes, contactos){
    
    let listaCorreos = []
    let idsUnicos = [...new Set(pendientes.map(p => p.numeroEmpleado))]
    
    
    let actividades = idsUnicos.map((num) => {
        // se buscan actividades del usuario
        let registros = pendientes.filter(p =>{return p.numeroEmpleado == num})
        //  se declara la lista de actividades vacia y se busca el correo de la persona
        
        let contacto = contactos.find((p) => p.id == num)
        let correo = null
        let usuario = null
        
        if(!contacto) throw new Error(`el numero de empleado ${num} no se encuentra registrado en la base de datos de comunicaciones`)
        correo = contacto.email
        let c = pendientes.find((n) => n.numeroEmpleado == num)
        if(!c) throw new Error('no hay contacto en los pendientes')
        usuario = c.responsable
        
        // se arma el objeto con las actividades
        let listaActividades = []
        registros.map((r)=>{
            let fecha = new Date(r.fechaCompromiso)
            fecha = fecha.toLocaleDateString("es-ES")

            let act = new actividad(r.nombreActividad, fecha)
            listaActividades.push(act)
        })

        
        // let cont = `
        //     buen dia ${usuario}, para recordarte que tienes ${listaActividades.length} actividades por cerrar.<br><br><br>
        // `
        let cont = `
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px 0;">
                <!-- Container principal -->
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
                                📋 Recordatorio de Actividades
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Contenido principal -->
                    <tr>
                        <td style="padding: 30px;">
                            <!-- Saludo -->
                            <div style="margin-bottom: 25px;">
                                <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 20px;">
                                    ¡Buen día, ${usuario}! 👋
                                </h2>
                                <p style="color: #666666; margin: 0; font-size: 16px; line-height: 1.5;">
                                    Te escribimos para recordarte que tienes 
                                    <strong style="color: #667eea;">${listaActividades.length} actividades</strong> 
                                    por cerrar.
                                </p>
                            </div>
                            
                            <!-- Separador -->
                            <hr style="border: none; height: 1px; background-color: #e0e0e0; margin: 25px 0;">
                            
                            <!-- Título de la tabla -->
                            <h3 style="color: #333333; margin: 0 0 20px 0; font-size: 18px;">
                                📅 Actividades Pendientes
                            </h3>
                            
                            <!-- Tabla de actividades -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden;">
                                <!-- Header de la tabla -->
                                <thead>
                                    <tr style="background-color: #f8f9fa;">
                                        <th style="padding: 15px; text-align: left; font-weight: bold; color: #333333; border-bottom: 2px solid #e0e0e0; font-size: 14px;">
                                            Nombre de la Actividad
                                        </th>
                                        <th style="padding: 15px; text-align: left; font-weight: bold; color: #333333; border-bottom: 2px solid #e0e0e0; font-size: 14px;">
                                            Fecha de Entrega
                                        </th>
                                    </tr>
                                </thead>
                                <!-- Cuerpo de la tabla -->
                                <tbody>`
                                
                                    
                                    
        for (let i = 0; i < listaActividades.length; i++) {
            cont += `<tr style="border-bottom: 1px solid #e0e0e0;">
                                        <td style="padding: 15px; color: #333333; font-size: 14px; vertical-align: top;">
                                            ${listaActividades[i].titulo}
                                        </td>
                                        <td style="padding: 15px; color: #666666; font-size: 14px; vertical-align: top;">
                                            <span style="background-color: #fff3cd; color: #856404; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                                                ${listaActividades[i].fechaVencimiento}
                                            </span>
                                        </td>
                                    </tr>`
        }
        cont += `
                                    <!-- Más filas aquí -->
                                </tbody>
                            </table>
                            
                            <!-- Mensaje de acción -->
                            <div style="margin-top: 25px; padding: 20px; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid #667eea;">
                                <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.5;">
                                    💡 <strong>Tip:</strong> Te recomendamos revisar y completar estas actividades lo antes posible para mantener tu progreso al día.
                                    <a href = 'https://www.qualitybolca.net/calidad/misActividades'>puedes consultas tus actividades aqui</>
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; color: #666666; font-size: 12px;">
                                Este es un recordatorio automático. Si tienes alguna pregunta, no dudes en contactarnos.
                            </p>
                            <p style="margin: 10px 0 0 0; color: #999999; font-size: 11px;">
                                © 2024 Quality Bolca. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
        `
        let notificacion = new Correo(correo, 'ACTIVIDADES PENDIENTES','TEXTO PLANO', cont)
        listaCorreos.push(notificacion)
    })
return listaCorreos
}

class actividad{
    constructor(titulo,fechaVencimiento){
        this.titulo = titulo,
        this.fechaVencimiento = fechaVencimiento
        if(!titulo || !fechaVencimiento) throw new Error('se requiere los datos completos de la actividad')
    }
}

export default recordatorioActividades;