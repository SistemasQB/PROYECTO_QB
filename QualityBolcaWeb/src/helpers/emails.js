import e from "express";
import nodemailer from "nodemailer";
// const fs = require("fs");
import fs from "fs"
import { DATE } from "sequelize";



const emailRegistro = async (datos) => {
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
    const ruta = process.env.BACKEND_URL + '/confirmar/' + token;
    await transport.sendMail({
        from: 'sistema@qualitybolca.net',
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
const emailOlvidePassword = async (datos) => {
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
        from: 'sistema@qualitybolca.net',
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
const emailRequisicion = async (datos) => {
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

const emailCursos = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAILC_USER,
            pass: process.env.EMAILC_PASS
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

const registroCursos = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAILC_USER,
            pass: process.env.EMAILC_PASS
        }
    });

    const { nombreCurso, asistenciaNombres, correo, fecha, horario, ubicacion, correoDestino, nombreContacto } = datos


    //Enviar el email
    await transport.sendMail({
        from: 'cursos@qualitybolca.net',
        to: correoDestino,
        subject: 'solicitud de curso',
        text: 'solicitud de curso',
        html: `
            <p>Hola ${nombreContacto}, Tienes una peticion de tu curso: ${nombreCurso}</p>
            <p>para el dia ${fecha}, en el siguiente horario ${horario}, en la ubicacion de ${ubicacion}
            si te es posible realizarlo puedes confirmar que aceptas impartir tu curso al siguiente correo: ${correo}
            </p>
            <p> A la cual asistiran las siguientes personas:</p>
            <p>${asistenciaNombres}</p>
        `
    })
}

const enviarQueja = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAILBQ_USER,
            pass: process.env.EMAILBQ_PASS
        }
    });

    const { nombreCurso, asistenciaNombres, correo, fecha, horario, ubicacion, correoDestino, nombreContacto } = datos


    //Enviar el email
    await transport.sendMail({
        from: process.env.EMAILBQ_USER,
        to: 'capitalhumano@qualitybolca.com.mx',
        subject: 'Buzon de quejas',
        text: 'Buzon de quejas',
        html: `
            <p>Hola equipo de capital humano, tienen una nueva notificacion de queja</p>
            <p>para el dia ${fecha}, en el siguiente horario ${horario}, en la ubicacion de ${ubicacion}
            si te es posible realizarlo puedes confirmar que aceptas impartir tu curso al siguiente correo: ${correo}
            </p>
            <p> A la cual asistiran las siguientes personas:</p>
            <p>${asistenciaNombres}</p>
        `
    })
}

const emailMantenimientoA = async (data) => {

    const { region, respuestas, tipo, nombre } = data


    let respuestas2 = respuestas.split(',')

    

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAILMA_USER,
            pass: process.env.EMAILMA_PASS
        }
    });

    //Enviar el email
    await transport.sendMail({
        from: process.env.EMAILMA_USER,
        to: 'itzel.reyes@qualitybolca.net',
        cc: 'info.sistemas@qualitybolca.com',
        subject: 'Mantenimiento Autonomo',
        text: 'Mantenimiento Autonomo',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registro de Mantenimiento Autónomo</title>
<style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #ddd;
          }
          .logo {
            color: #0066cc;
            font-weight: bold;
            font-size: 24px;
          }
          .logo span {
            color: #333;
          }
          .document-info {
            text-align: right;
            font-size: 14px;
          }
          .main-content {
            padding: 20px 0;
          }
          .form-group {
            margin-bottom: 15px;
          }
          .form-label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
          }
          .form-value {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #f9f9f9;
          }
          .checklist-title {
            background-color: #2c3e50;
            color: white;
            padding: 10px;
            margin-top: 20px;
            margin-bottom: 15px;
            border-radius: 4px;
          }
          .checklist-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .checklist-item {
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 4px;
          }
          .checkbox {
            margin-right: 10px;
          }
          @media (max-width: 600px) {
            .checklist-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>

      </head>
      <body>
        <div class="header">
          <div class="logo">Quality <span>BOLCA</span></div>
          <div class="document-info">
            <div>Código: QS-FR-A-16-01</div>
            <div>Rev: 00</div>
            <div>Fecha de emisión: 10-04-2023</div>
            <div>Fecha de revisión: N/A</div>
          </div>
        </div>
        
        <div class="main-content">
          <h1 style="text-align: center;">REGISTRO DE MANTENIMIENTO AUTÓNOMO</h1>
          
          <div class="form-group">
            <div class="form-label">Nombre quien realiza:</div>
            <div class="form-value">${data.nombre}</div>
          </div>
          
          <div class="form-group">
            <div class="form-label">Tipo de Equipo:</div>
            <div class="form-value">${data.tipo}</div>
          </div>
          
          <div class="form-group">
            <div class="form-label">Región:</div>
            <div class="form-value">${data.region}</div>
          </div>
          
          <div class="checklist-title">Checklist</div>
          
          <div class="checklist-grid">
          <div class="checklist-item">
              <input type="checkbox" class="checkbox" ${respuestas2[0] == "true" ? "checked" : ""} disabled>
              Realizar actualizaciones
            </div>
            <div class="checklist-item">
              <input type="checkbox" class="checkbox" ${respuestas2[1] == "true" ? "checked" : ""} disabled>
              Funcionamiento de altavoces(solo si aplica)
            </div>
            <div class="checklist-item">
              <input type="checkbox" class="checkbox" ${respuestas2[2] == "true" ? "checked" : ""} disabled>
              Funcionamiento puertos USB
            </div>
            <div class="checklist-item">
              <input type="checkbox" class="checkbox" ${respuestas2[3] == "true" ? "checked" : ""} disabled>
              Funcionamiento adaptador de red
            </div>
            <div class="checklist-item">
              <input type="checkbox" class="checkbox" ${respuestas2[4] == "true" ? "checked" : ""} disabled>
              Limpieza general del equipo
            </div>
            <div class="checklist-item">
              <input type="checkbox" class="checkbox" ${respuestas2[5] == "true" ? "checked" : ""} disabled>
              Funcionamiento de cámara y micrófono(solo si aplica)
            </div>
            <div class="checklist-item">
              <input type="checkbox" class="checkbox" ${respuestas2[6] == "true" ? "checked" : ""} disabled>
              Funcionamiento y limpieza de teclado y mouse
            </div>
            <div class="checklist-item">
              <input type="checkbox" class="checkbox" ${respuestas2[7] == "true" ? "checked" : ""} disabled>
              Funcionamiento cargador y centro de carga
            </div>
          </div>
          <br>
          <p style="text-align: center;">${data.nombre}</p>
          <p style="text-align: center; text-decoration: overline;">NOMBRE / FIRMA QUIEN REALIZA</p>
        </div>
      </body>
      </html>
        `
    })
}

const emailSolicitud = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAILMS_USER,
            pass: process.env.EMAILMS_PASS
        }
    });

    const { idFolio, solcitante } = datos

    //Enviar el email
    await transport.sendMail({
        from: process.env.EMAILMS_USER,
        to: 'itzel.reyes@qualitybolca.net',
        cc: 'info.sistemas@qualitybolca.com',
        subject: 'Solicitud de Servicio',
        text: 'Solicitud de Servicio',
        html: `
            <p>Hola Equipo de sistemas, Tienen una solicitud por parte de ${solcitante}</p>
            <p>con numero de folio ${idFolio} puedes acceder desde la pagina WEB
            <a href="www.qualitybolca.net">Pagina Web</a>
            </p>
        `
    })
}

const emailMejora = async (datos) => {

  console.log('Enviado...',datos);
  

  const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAILMC_USER,
            pass: process.env.EMAILMC_PASS
        }
    });

    await transport.sendMail({
        from: process.env.EMAILMC_USER,
        to: datos.email,
        subject: cuerpoCorreoMejora[datos.id].asunto + ' ' + datos.nombre_mejora,
        text: 'Prueba de las mejoras',
        html: generarCuerpoEmail(datos)
    })
}

const emailMejoraRespuesta = async (datos) => {

  const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAILMC_USER,
            pass: process.env.EMAILMC_PASS
        }
    });


    if (datos.id == 1) {
        await transport.sendMail({
        from: process.env.EMAILMC_USER,
        to: 'propuestas.mejora@gmail.com',
        subject: 'Nueva propuesta de MEJORA' + ' ' + datos.nombre_mejora,
        text: 'Prueba de las mejoras',
        html: `
        <p>Buen dia equipos de calidad, tienen una nueva propuesta de mejora continua</p>
        <p>pueden visualizarla entrando a la pagina web de: <a href="www.qualitybolca.net">www.qualitybolca.net</a></p>
        `
    })
    }

    await transport.sendMail({
        from: process.env.EMAILMC_USER,
        to: datos.email,
        subject: 'MEJORA' + ' ' + datos.nombre_mejora + ' FUE' + ' ' + datos.resultado,
        text: 'Prueba de las mejoras',
        html: cuerpoRespusetaComite(datos)
        
    })
}

function cuerpoRespusetaComite(params) {
let respuestaComite
if (!params.fecha_respuesta_comite) {
    respuestaComite = 
  `
          <h5>Buen dia ${params.generador_idea}</h5>
          <p> El día de hoy se llevó a cabo la revisión de las propuestas de mejora continua en la junta con el Comité de Mejora Continua, 
          en la cual se decidió que la propuesta de mejora '<b>${params.nombre_mejora}</b>' se encuentra marcada como <b>${params.resultado}</b></p>
          <p>para ver el resultado de la evaluación de la mejora puedes acceder desde la pagina WEB <a href="www.qualitybolca.net">Pagina Web</a></p>
          <p>Gracias por enviarnos tu propuesta, te animamos a seguir participando. ¡Saludos! </p>
        `
}else{
  respuestaComite = 
  `
          <h5>Buen dia ${params.generador_idea}</h5>
          <p> El día de hoy se llevó a cabo la revisión de las propuestas de mejora continua en la junta con el Comité de Mejora Continua, 
          en la cual se decidió que la propuesta de mejora '<b>${params.nombre_mejora}</b>' se encuentra marcada como <b>${params.resultado}</b></p>
          <p>sin embargo la mejora empezara a ser evaluada a partir de la siguiente fecha <b>${params.fecha_respuesta_comite}</b></p>
          <p>para ver el resultado de la evaluación de la mejora puedes acceder desde la pagina WEB <a href="www.qualitybolca.net">Pagina Web</a></p>
          <p>Gracias por enviarnos tu propuesta, te animamos a seguir participando. ¡Saludos! </p>
        `
}





  return respuestaComite
}

function generarCuerpoEmail(datos) {
  

  fechaLimite = datos.fecha_limite

  let cuerpoCorreo ='Buen dia ' + datos.generador_idea + ' ' + cuerpoCorreoMejora[datos.id].cuerpo1 + ' ' + datos.periodo + ' ' + datos.nombre_mejora + ' ' + cuerpoCorreoMejora[datos.id].cuerpo2 + ' ' + cuerpoCorreoMejora[datos.id].cuerpo3 + ' ' + cuerpoCorreoMejora[datos.id].cuerpo4

  return cuerpoCorreo
}

let fechaLimite

let cuerpoCorreoMejora = 
[
  {
  "id": 1,
  "asunto": "MEJORA REGISTRADA",
  "cuerpo1": "te confirmamos que tu mejora",
  "cuerpo2": "ha sido recibida con exito.",
  "cuerpo3": "",
  "cuerpo4": ""
},
  {
  "id": 2,
  "asunto": "Notificación de falta de evidencia de la mejora",
  "cuerpo1": "De tu apoyo con él envió de la evidencia de implementación de de tu mejora",
  "cuerpo2":  ", Dado que el plazo ha vencido, se notifica que cuenta con 5 días hábiles a partir de esta fecha para realizar el envío de la evidencia correspondiente,",
  "cuerpo3": "en caso de no recibir la evidencia dentro de este periodo será DECLINADA por falta de seguimiento. ",
  "cuerpo4": "Quedamos a la espera de la evidencia solicitada. ¡Saludos!"
},
{
  "id": 3,
  "asunto": "DECLINACIÓN DE PROPUESTA",
  "cuerpo1": "Para informarte que la Mejora ",
  "cuerpo2":  "se procederá a Declinar en el sistema, esto se debe a la falta de seguimiento adecuado y la no implementación de las acciones necesarias en los plazos establecidos tal cual lo indica nuestro procedimiento de Mejora Continua QB-PR-A-06.",
  "cuerpo3": "Quedamos atentos para cualquier duda o aclaración. Saludos.",
  "cuerpo4": ""
},
{
  "id": 4,
  "asunto": "MEJORA RECHAZADA",
  "cuerpo1": "El día de hoy se llevó a cabo la revisión de las propuestas de mejora continua en la junta con el Comité de Mejora Continua, en la cual se decidió que la propuesta de mejora'",
  "cuerpo2":  "",
  "cuerpo3": "Gracias por enviarnos tu propuesta, te animamos a seguir participando. ¡Saludos! ",
  "cuerpo4": ""
},
{
  "id": 5,
  "asunto": "IMPLEMENTACION DE MEJORA",
  "cuerpo1": "Gracias por compartirnos la evidencia solicitada, te notificamos que tu mejora '",
  "cuerpo2":  "'se encuentra marcada como implementada, ya que se cumplió con el monitoreo de tres meses, puedes agregarla a tu indicador en el mes de",
  "cuerpo3": obtenerMes(),
  "cuerpo4": "Gracias por enviarnos tu propuesta, no obstante, te animamos a seguir participando. ¡Saludos! "
},
{
  "id": 6,
  "asunto": "EVIDENCIA DE IMPLEMENTACIÓN DE MEJORA",
  "cuerpo1": "De tu apoyo con él envió de la evidencia de",
  "cuerpo2":  "Favor de enviar la evidencia a más tardar el ",
  "cuerpo3": fechaLimite,
  "cuerpo4": "Quedo a la espera de la evidencia solicitada. ¡Saludos!"
}
];

function obtenerMes() {
  
const fecha = new Date();
const numeroMes = fecha.getMonth();

const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
 return meses[numeroMes];


   
}

export {
    emailRegistro,
    emailOlvidePassword,
    emailRequisicion,
    emailCursos,
    registroCursos,
    emailMantenimientoA,
    enviarQueja,
    emailSolicitud,
    emailMejora,
    emailMejoraRespuesta
}