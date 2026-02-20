import nd from 'nodemailer'


class miNodemailer{
     
    constructor({datosSmtp}){
        if(!datosSmtp) throw new Error('se requieren los datos del smtp')
        const {host, port} = datosSmtp
        const {user, pass} = datosSmtp.auth
        
        this.smtp = {
            host: host,
            port: port,
            auth: {
                user: user,
                pass: pass,
            }
        }
    }
async enviarCorreo({Datoscorreo}){
    if(!Datoscorreo) return 'se necesitan los datos del correo'
    try{
        const transporter = nd.createTransport(this.smtp)
        return await transporter.sendMail({
        from: this.smtp.auth.user,
        to: Datoscorreo.destinatario,
        subject:  Datoscorreo.asunto,
        text:  Datoscorreo.texto,
        html:  Datoscorreo.html,
        cc: Datoscorreo.cc ? Datoscorreo.cc : null
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
htmlPedidoInsumos(){
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Pedido de Insumos</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 600px;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #2563eb; padding: 30px 40px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0;">
                🔔 Nuevo Pedido de Insumos
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 0 0 20px 0;">
                ¡Buen día, Compras!
              </p>
              <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 0 0 25px 0;">
                Te notificamos que tienes un <strong style="color: #2563eb;">nuevo pedido de insumos</strong>, por favor revisa el sistema de administración para ver más detalles.
              </p>
              
              <!-- Info Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #eff6ff; border-left: 4px solid #2563eb; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #1e40af; font-size: 14px; margin: 0; font-weight: 600;">
                      📋 Acción requerida
                    </p>
                    <p style="color: #3b82f6; font-size: 14px; margin: 8px 0 0 0;">
                      Ingresa al sistema para revisar los detalles del pedido.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://www.qualitybolca.net/infraestructura/gestionpedidosInsumos" style="background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 40px; border-radius: 6px; display: inline-block;">
                      Ver Pedido
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                Este es un mensaje automático. No responda a este correo.
              </p>
              <p style="color: #d1d5db; font-size: 12px; margin: 15px 0 0 0;">
                © 2026 Tu Empresa
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

htmlOrdenesCompra({datos}){
        let partidas = datos.servicios.partidas
        let f = new Date(datos.fecha)
        const ano = f.getFullYear()
        let html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Orden de Compra</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <!-- Contenedor principal  -->
                        <table role="presentation" style="max-width: 800px; width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
                            
                            <!-- Encabezado  -->
                            <tr>
                                <td style="background: background-color:#1a1a2e; padding: 40px 40px 30px 40px; text-align:center;">
                                    <img src="https://www.qualitybolca.net/img/qbp.png" alt="" style="width: 100%; height: 100%;  display: block;">
                                </td>
                            </tr>
                            <tr>
                                <td style="background: background-color:#1a1a2e; padding: 40px 40px 30px 40px; text-align:center;">    
                                    <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: 600;">ORDEN DE COMPRA</h1>
                                </td>
                            </tr>

                            <!-- Información de la orden  -->
                            <tr>
                                <td style="padding: 30px 40px; background-color: #f8f9fa; border-bottom: 1px solid #e1e8ed;">
                                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="width: 33%; padding-right: 20px;">
                                                <p style="margin: 0 0 5px 0; font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">No. de Orden</p>
                                                <p style="margin: 0; font-size: 18px; color: #1a1a2e; font-weight: 600;">OC-${ano}-${datos.id}</p>
                                            </td>
                                            <td style="width: 33%; text-align: right;">
                                                <p style="margin: 0 0 5px 0; font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">lugar</p>
                                                <p style="margin: 0; font-size: 18px; color: #1a1a2e; font-weight: 600;">${datos.lugar}</p>
                                            </td>
                                            <td style="width: 33%; text-align: right;">
                                                <p style="margin: 0 0 5px 0; font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Fecha</p>
                                                <p style="margin: 0; font-size: 18px; color: #1a1a2e; font-weight: 600;">${f.toLocaleDateString('en-GB')}</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Mensaje  -->
                            <tr>
                                <td style="padding: 35px 40px; line-height: 1.7;">
                                    <p style="margin: 0 0 15px 0; font-size: 16px; color: #2c3e50;">Buen día,</p>
                                    <p style="margin: 0 0 15px 0; font-size: 16px; color: #2c3e50;">Estimado proveedor <strong style="color: #1a1a2e;">${datos.informacionProveedor.proveedor}</strong>,</p>
                                    <p style="margin: 0 0 15px 0; font-size: 16px; color: #2c3e50;">Anexo orden de compra correspondiente para que puedan surtir el pedido. Agradezco de antemano me confirmen la fecha estimada de entrega.</p>
                                    <p style="margin: 0; font-size: 16px; color: #2c3e50;">Cualquier duda o aclaración estoy a sus órdenes.</p>
                                </td>
                            </tr>

                            <!-- Tabla de productos  -->
                            <tr>
                                <td style="padding: 0 40px 30px 40px;">
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e1e8ed; border-radius: 6px; overflow: hidden;">

                                            
                                            <tr>
                                                <td style="border: 1px solid #cccccc; padding: 12px; font-size: 12px; color: #333333;">No.</td>
                                                <td style="border: 1px solid #cccccc; padding: 12px; font-size: 12px; color: #333333;">Servicio/Producto</td>
                                                <td style="border: 1px solid #cccccc; padding: 12px; font-size: 12px; color: #333333;">Cantidad</td>
                                                <td style="border: 1px solid #cccccc; padding: 12px; font-size: 12px; color: #333333;">Precio Unit.</td>
                                                <td style="border: 1px solid #cccccc; padding: 12px; font-size: 12px; color: #333333;">Precio Total</td>
                                        // </tr>
                                        `

                                            for (let i = 0; i < datos.servicios.partidas.length; i++) {
                                                let parti = partidas[i]
                                                html +=`<tr style="border-bottom: 1px solid #e1e8ed; background-color: #ffffff;">
                                                <td style="padding: 15px 12px; text-align: center; color: #2c3e50; font-size: 14px;">${parti.item}</td>
                                                <td style="padding: 15px 12px; text-align: left; color: #2c3e50; font-size: 14px;">${parti.producto}</td>
                                                <td style="padding: 15px 12px; text-align: center; color: #2c3e50; font-size: 14px;">${parti.cantidad}</td>
                                                <td style="padding: 15px 12px; text-align: right; color: #2c3e50; font-size: 14px;">${this.formatearPesos(parti.precioUnitario)}</td>
                                                <td style="padding: 15px 12px; text-align: right; color: #2c3e50; font-size: 14px; font-weight: 600;">${this.formatearPesos(parti.precioTotal)}</td>
                                            </tr>`     
                                            }

                    html+=`
                                        
                                    </table>
                                </td>
                            </tr>

                            <!-- Totales  -->
                            <tr>
                                <td style="padding: 0 40px 30px 40px;">
                                    <table role="presentation" style="width: 100%; max-width: 350px; margin-left: auto; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 10px 0; border-bottom: 1px solid #e1e8ed;">
                                                <span style="font-size: 15px; color: #6c757d; font-weight: 500;">Subtotal:</span>
                                            </td>
                                            <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #e1e8ed;">
                                                <span style="font-size: 15px; color: #2c3e50; font-weight: 600;">${datos.servicios.subtotal}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px 0; border-bottom: 1px solid #e1e8ed;">
                                                <span style="font-size: 15px; color: #6c757d; font-weight: 500;">IVA (16%):</span>
                                            </td>
                                            <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #e1e8ed;">
                                                <span style="font-size: 15px; color: #2c3e50; font-weight: 600;">${datos.servicios.iva}</span>
                                            </td>
                                        </tr>
                                        
                                        <tr>
                                            <td style="padding: 15px 0 10px 0; background-color: #f8f9fa; padding-left: 15px; border-radius: 6px 0 0 6px;">
                                                <span style="font-size: 17px; color: #1a1a2e; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Total:</span>
                                            </td>
                                            <td style="padding: 15px 0 10px 0; text-align: right; background-color: #f8f9fa; padding-right: 15px; border-radius: 0 6px 6px 0;">
                                                <span style="font-size: 22px; color: #1a1a2e; font-weight: 700;">${datos.servicios.total}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Observaciones  -->
                            <tr>
                                <td style="padding: 0 40px 35px 40px;">
                                    <div style="background-color: #f8f9fa; border-left: 4px solid #2c3e50; padding: 20px 25px; border-radius: 4px;">
                                        <p style="margin: 0 0 10px 0; font-size: 13px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Observaciones</p>
                                        <p style="margin: 0; font-size: 15px; color: #2c3e50; line-height: 1.6;">${datos.observaciones}</p>
                                    </div>
                                </td>
                            </tr>

                            <!-- Firmas/Autorizaciones  -->
                            <tr>
                                <td style="padding: 20px 40px 40px 40px;">
                                    <p style="margin: 0 0 25px 0; font-size: 13px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; text-align: center;">Autorizaciones</p>
                                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="width: 33.33%; padding: 0 10px; text-align: center; vertical-align: top;">
                                                <div style="background-color: #f8f9fa; border: 2px solid #e1e8ed; border-radius: 8px; padding: 20px 15px; ">
                                                    <div style="width: 100px; height: 100px; margin: 0 auto 15px auto; border-radius: 5%; overflow: hidden; border: 3px solid #2c3e50; background-color: #ffffff;">
                                                        <img src="https://www.qualitybolca.net/img/JOSA.jpg" alt="" style="width: 100%; height: 100%;  display: block;">
                                                    </div>
                                                    <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600; line-height: 1.4;">SANCHEZ LOPEZ JOSAAT EDUARDO</p>
                                                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #6c757d; font-weight: 500;">ANALISTA DE GESTION DE GASTOS</p>
                                                </div>
                                            </td>
                                            <!-- Firma 2  -->
                                            <td style="width: 33.33%; padding: 0 10px; text-align: center; vertical-align: top;">
                                                <div style="background-color: #f8f9fa; border: 2px solid #e1e8ed; border-radius: 8px; padding: 20px 15px; ">
                                                    <div style="width: 100px; height: 100px; margin: 0 auto 15px auto; border-radius: 50%; overflow: hidden; border: 3px solid #2c3e50; background-color: #ffffff;">
                                                        <img src="https://www.qualitybolca.net/img/LESS.jpg" alt="" style="width: 100%; height: 100%;  display: block;">
                                                    </div>
                                                    <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600; line-height: 1.4;">REYES NICASIO LESLIE CECILIA</p>
                                                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #6c757d; font-weight: 500;">AUXILIAR DE COMPRAS Y SUMINISTROS</p>
                                                </div>
                                            </td>
                                            <!-- Firma 3  -->
                                            <td style="width: 33.33%; padding: 0 10px; text-align: center; vertical-align: top;">
                                                <div style="background-color: #f8f9fa; border: 2px solid #e1e8ed; border-radius: 8px; padding: 20px 15px;">
                                                    <div style="width: 100px; height: 100px; margin: 0 auto 15px auto; border-radius: 50%; overflow: hidden; border: 3px solid #2c3e50; background-color: #ffffff;">
                                                        <img src="https://www.qualitybolca.net/img/GABI.jpg" alt="" style="width: 100%; height: 100%;  display: block;">
                                                    </div>
                                                    <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600; line-height: 1.4;">CADENA MENDOZA EVA GABRIELA</p>
                                                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #6c757d; font-weight: 500;">JEFE DE COMPRAS Y SUMINISTROS</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Pie de página  -->
                            <tr>
                                <td style="background-color: #16213e ; padding: 25px 40px; text-align: center;">
                                    <p style="margin: 0 0 5px 0; font-size: 14px; color: #a8b2d1; line-height: 1.6;">Saludos cordiales</p>
                                    <p style="margin: 0; font-size: 12px; color: #6c7a9d; line-height: 1.6;">QUALITY BOLCA | +52 449 243 5163 | grupo.compras@qualitybolca.com</p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
            `        
        return html
        
    }
    htmlConfirmacionSurtimiento(datosSolicitante){
      let f = new Date(Date.now()).toLocaleDateString('es-MX');
        return `
        <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedido Surtido</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f5;">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Contenedor principal -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #16a34a; padding: 32px 40px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">
                    <!-- Icono de check -->
                    <div style="width: 48px; height: 48px; background-color: #ffffff; border-radius: 50%; display: inline-block; text-align: center; line-height: 48px;">
                      <span style="color: #16a34a; font-size: 28px; font-weight: bold;">✓</span>
                    </div>
                  </td>
                  <td style="vertical-align: middle;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">¡Pedido Surtido!</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Cuerpo del mensaje -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Estimado/a <strong style="color: #111827;">{${datosSolicitante.nombrelargo}</strong>,
              </p>
              
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Nos complace informarte que tu pedido de insumos ha sido <strong style="color: #16a34a;">surtido con éxito</strong>.
              </p>
              
              <!-- Caja de información del pedido -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Número de Pedido</span><br>
                          <span style="color: #111827; font-size: 18px; font-weight: 600;">#${datosSolicitante.id}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px;">
                          <span style="color: #6b7280; font-size: 14px;">Fecha de Surtido</span><br>
                          <span style="color: #111827; font-size: 16px; font-weight: 500;">${f}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Los insumos solicitados ya están listos para su entrega o recolección según corresponda.
              </p>
              
              <p style="margin: 0 0 8px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos.
              </p>
            </td>
          </tr>
          
          <!-- Separador -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #e5e7eb;"></div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                Gracias por tu confianza.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Este es un correo automático, por favor no respondas directamente a este mensaje.
              </p>
              <p style="margin: 16px 0 0 0; color: #111827; font-size: 14px; font-weight: 600;">
                QUALITY BOLCA
              </p>
            </td>
          </tr>
          
        </table>
        
        <!-- Texto legal fuera del contenedor -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px;">
          <tr>
            <td style="padding: 24px 20px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                © QUALITY BOLCA. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>`
}
htmlNotificacionNuevaReqEquipo(datosNotificacion){
  console.log('lo que se le paso a la funcion:', datosNotificacion)
  return `
  <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Solicitud Completada – IT</title>
</head>
<body style="margin:0;padding:0;background-color:#0f1117;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1117;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="560" cellpadding="0" cellspacing="0" style="
          background: linear-gradient(160deg, #1a1d2e 0%, #12151f 100%);
          border-radius: 20px;
          border: 1px solid #2a2f45;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
          overflow: hidden;
        ">

          <!-- Top accent bar -->
          <tr>
            <td style="
              background: linear-gradient(90deg, #4f6ef7, #a66ff7, #4fc3f7);
              height: 4px;
              font-size: 0;
              line-height: 0;
            ">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 24px;">

              <!-- Icon badge -->
              <div style="
                width: 72px;
                height: 72px;
                background: linear-gradient(135deg, #4f6ef7 0%, #a66ff7 100%);
                border-radius: 18px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 24px;
                box-shadow: 0 8px 32px rgba(79,110,247,0.4);
              ">
                <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle" style="height:72px;">
                  <span style="font-size:32px;line-height:1;">✓</span>
                </td></tr></table>
              </div>

              <h1 style="
                margin: 0 0 8px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 3px;
                text-transform: uppercase;
                color: #4f6ef7;
              ">Departamento de Tecnologías de la Información</h1>

              <h2 style="
                margin: 0;
                font-size: 26px;
                font-weight: 700;
                color: #ffffff;
                letter-spacing: -0.5px;
                line-height: 1.3;
              ">Solicitud Completada</h2>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#2a2f45,transparent);"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px;">

              <!-- Greeting -->
              <p style="
                margin: 0 0 20px;
                font-size: 16px;
                color: #9ba5c0;
                line-height: 1.5;
              ">Buenos días, <strong style="color:#ffffff;font-weight:600;">${datosNotificacion.requesterName}</strong> 👋</p>

              <p style="
                margin: 0 0 28px;
                font-size: 15px;
                color: #9ba5c0;
                line-height: 1.7;
              ">
                Nos complace informarte que tu solicitud realizada al
                <strong style="color:#c4cde8;">Departamento de IT</strong>
                ha sido <span style="color:#6ee7a0;font-weight:600;">procesada y completada exitosamente</span>.
                Tu requerimiento ha sido atendido y puedes hacer uso del servicio o recurso solicitado.
              </p>

              <!-- Info card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="
                background: rgba(79,110,247,0.07);
                border: 1px solid rgba(79,110,247,0.2);
                border-radius: 12px;
                margin-bottom: 28px;
              ">
                <tr>
                  <td style="padding: 20px 24px;">

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding-bottom:16px;">
                          <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#4f6ef7;font-weight:700;">Solicitante</p>
                          <p style="margin:0;font-size:14px;color:#e0e6f5;font-weight:500;">${datosNotificacion.requesterName}</p>
                        </td>
                        <td width="50%" style="padding-bottom:16px;">
                          <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#4f6ef7;font-weight:700;">N° de Solicitud</p>
                          <p style="margin:0;font-size:14px;color:#e0e6f5;font-weight:500;">${datosNotificacion.id}</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%">
                          <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#4f6ef7;font-weight:700;">Tipo de Solicitud</p>
                          <p style="margin:0;font-size:14px;color:#e0e6f5;font-weight:500;">REQUISICION DE EQUIPOS</p>
                        </td>
                        <td width="50%">
                          <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#4f6ef7;font-weight:700;">Fecha de Cierre</p>
                          <p style="margin:0;font-size:14px;color:#e0e6f5;font-weight:500;">${new Date().toLocaleDateString('en-GB')}</p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Status badge -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="
                    background: rgba(110,231,160,0.1);
                    border: 1px solid rgba(110,231,160,0.3);
                    border-radius: 999px;
                    padding: 8px 18px;
                    display:inline-block;
                  ">
                    <span style="
                      display:inline-block;
                      width:8px;
                      height:8px;
                      background:#6ee7a0;
                      border-radius:50%;
                      margin-right:8px;
                      vertical-align:middle;
                    "></span>
                    <span style="
                      font-size:13px;
                      font-weight:600;
                      color:#6ee7a0;
                      letter-spacing:0.5px;
                      vertical-align:middle;
                    ">${datosNotificacion.observaciones}</span>
                  </td>
                </tr>
              </table>

              <p style="
                margin: 0 0 28px;
                font-size:14px;
                color: #6b7599;
                line-height: 1.7;
              ">
                Si tienes alguna duda sobre el servicio proporcionado o necesitas soporte adicional,
                no dudes en contactarnos. Estamos aquí para ayudarte.
              </p>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#2a2f45,transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:12px;color:#4a5175;line-height:1.6;">
                      Este mensaje fue generado automáticamente por el sistema de gestión de solicitudes de IT.
                      Por favor no respondas a este correo directamente.
                    </p>
                    <p style="margin:0;font-size:12px;color:#4a5175;">
                      © 2025 · Departamento de Tecnologías de la Información · Todos los derechos reservados.
                    </p>
                  </td>
                  <td align="right" valign="middle" style="padding-left:16px;">
                    <div style="
                      width:36px;
                      height:36px;
                      background:linear-gradient(135deg,#4f6ef7,#a66ff7);
                      border-radius:8px;
                      opacity:0.5;
                    "></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>
  `

}
    formatearPesos(monto){
    return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(monto);
    }
}

export default miNodemailer;