
import * as msal from "@azure/msal-node";
import axios from "axios";

class azureClass {
    constructor({idAplicacion,idDirectorio,secreto,correo}){ 
        console.log(idAplicacion,idDirectorio,secreto,correo)
        if(!idAplicacion || !idDirectorio || !secreto || !correo) throw new Error( 'se necesitan los datos de azure')

        this.id_Aplicacion = process.env[idAplicacion]
        this.id_directorio = process.env[idDirectorio]
        this.secreto = process.env[secreto]
        this.correo = process.env[correo]

         this.cliente = new msal.ConfidentialClientApplication({
            auth: {
                clientId: this.id_Aplicacion,
                clientSecret: this.secreto,
                authority: `https://login.microsoftonline.com/${this.id_directorio}`,
            }
        })
    }

    async enviarCorreo({destinatario,asunto, html=null, texto= null}){
        if(!destinatario || !asunto) throw new Error('se necesitan los datos del destinatario y el asunto del correo')
        if(!html && !texto) throw new Error('se necesita el cuerpo del correo para poder enviarlo.')
        try {
            const miToken = await this.obtenerToken()
        await axios.post(
            `https://graph.microsoft.com/v1.0/users/${this.correo}/sendMail`,{
                message: {
                    subject: asunto,  
                body:  {
                    contentType: 'HTML',
                    content: html  
                },
                toRecipients: [{emailAddress: {address: destinatario}}],
                },
                saveToSentItems: true},
                {
                    headers: {
                        'Authorization': `Bearer ${miToken}`,
                        'Content-Type': 'application/json'
                    }
                }
        )
        return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async obtenerToken(){
        try {
            const resultado = await this.cliente.acquireTokenByClientCredential({
                scopes: ["https://graph.microsoft.com/.default"],
            })
            if(!resultado) return 'no se pudo obtener el token'

            return resultado.accessToken
        }catch (error) {
            throw new Error(error.message)
        }
    }   
}
export default azureClass
