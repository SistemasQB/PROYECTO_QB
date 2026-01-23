import nodemailer from "../../../clases/nodemailer.js";
import azureClase from "../../../clases/azureClass.js"; 

async function envioOC({datos}){    
    try{
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
                        <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 40px 30px 40px; text-align: center;">
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
                                        <td style="padding: 15px 12px; text-align: right; color: #2c3e50; font-size: 14px;">${formatearPesos(parti.precioUnitario)}</td>
                                        <td style="padding: 15px 12px; text-align: right; color: #2c3e50; font-size: 14px; font-weight: 600;">${formatearPesos(parti.precioTotal)}</td>
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
                        <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px 40px; text-align: center;">
                            <p style="margin: 0 0 5px 0; font-size: 14px; color: #a8b2d1; line-height: 1.6;">Saludos cordiales</p>
                            <p style="margin: 0; font-size: 12px; color: #6c7a9d; line-height: 1.6;">QUALITY BOLCA | +52 449 243 5163 | leslie.reyes@qualitybolca.net</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `                                    
    const miAzureClase = new azureClase({ 
        idAplicacion: 'id_AplicacionCompras',
        idDirectorio: 'id_DirectorioCompras', 
        secreto: 'secreto_compras', 
        correo: 'correoCompras'
     })
    return await miAzureClase.enviarCorreo({destinatario:datos.informacionProveedor.correo,asunto:'ORDEN DE COMPRA DE QUALITY BOLCA',html:html,texto:'texto'})
    // const cor = new nodemailer()
    // cor.enviarCorreo({Correo: dato});
    
}catch(ex){
        console.log(`surgio un error: ${ex}`)
        return false
    }
}

function formatearPesos(monto){
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(monto);
}
export default envioOC;

