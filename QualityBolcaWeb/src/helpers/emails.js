import nodemailer from "nodemailer";


const emailRegistro = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAILI_USER,
            pass: process.env.EMAILI_PASS
        }
    });

    const { email, nombre, token } = datos

    //Enviar el email
    const ruta = process.env.BACKEND_URL + ':' + process.env.PORT + '/confirmar/' + token;
    await transport.sendMail({
        from: 'mantenimiento@qualitybolca.net',
        to: email,
        subject: 'Confirmar tu cuenta Qualitybolca.net',
        text: 'Confirmar tu cuenta Qualitybolca.net',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en Qualitybolca.net</p>
            <p>Tu cuenta ya esta lista, solo confirmala en el siguiente enlace:
            <a href="${ruta}">Confirmar cuenta</a>
            </p>
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}
const emailOlvidePassword = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAILI_USER,
            pass: process.env.EMAILI_PASS
        }
    });

    const { email, nombre, token } = datos

    //Enviar el email
    const ruta = process.env.BACKEND_URL + ':' + process.env.PORT + '/olvide-password/' + token;
    await transport.sendMail({
        from: 'mantenimiento@qualitybolca.net',
        to: email,
        subject: 'Retablece tu contraseña en Qualitybolca.net',
        text: 'Retablece tu contraseña en Qualitybolca.net',
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer tu contraseña en Qualitybolca.net</p>
            <p>Sigue el siguiente enlace para generar una contrseña nueva:
            <a href="${ruta}">Restablecer contraseña</a>
            </p>
            <p>Si tu no solicitaste el cambio de contrseña, puedes ignorar el mensaje</p>
        `
    })
}
const emailRequisicion = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAILR_USER,
            pass: process.env.EMAILR_PASS
        }
    });

    const { id, asunto, solicitante, autoriza } = datos
    console.log(autoriza);
    
    const nombre = 'Oscar'
    //Enviar el email
    await transport.sendMail({
        from: 'requisiciones@qualitybolca.net',
        to: autoriza,
        subject: 'Requisicion de compras',
        text: 'Requisicion de compras',
        html: `
            <p>Hola ${nombre}, Tienes una requisicion solicitada por ${solicitante}</p>
            <p>puedes acceder desde la pagina WEB en la pestaña de requisiciones solicitadas
            <a href="www.qualitybolca.net">Pagina Web</a>
            </p>
        `
    })
}

export {
    emailRegistro,
    emailOlvidePassword,
    emailRequisicion
}