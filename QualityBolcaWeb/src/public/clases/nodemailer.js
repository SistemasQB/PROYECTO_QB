import nd from 'nodemailer'


class nodemailer{
     
    constructor(){
        
    }
async enviarCorreo({Correo}){
    const smtp = {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_RECORDATORIO,
                pass: process.env.PASS_RECORDATORIO,
            }
        }
        console.log(smtp)
    this.Correo = Correo
    if(!Correo) return 'se necesitan los datos del correo'

    try{
        console.log(`se envio el correo de ${Correo.destinatario}`) 
        const transporter = nd.createTransport(smtp)
        await transporter.sendMail({
        from: process.env.EMAIL_RECORDATORIO,
        to:Correo.destinatario,
        subject: Correo.asunto,
        text: Correo.texto,
        html: Correo.html,
    })
    }catch(e){
        throw new Error(`${e}`)
    }
    
}
async enviarCorreosMasivos({listaCorreos}){
    for (const co of listaCorreos) {
        await this.enviarCorreo({Correo: co})
    }
    
}
}


export default nodemailer;