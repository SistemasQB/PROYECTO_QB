import nodemailer from "../../../clases/nodemailer.js";

function envioOC({datos}){    
    let basicas = deserializar(datos.basicas)
    let partidas = datos.partidas
    
    
    
    let f = new Date(basicas.fecha)
    const ano = f.getFullYear()
    
    let html = `
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 40px 20px;">
        <tr>
            <td align="center">
                 <!-- Contenedor principal  -->
                <table role="presentation" style="max-width: 800px; width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
                    
                     <!-- Encabezado  -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 40px 30px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">ORDEN DE COMPRA</h1>
                            <p style="margin: 10px 0 0 0; color: #a8b2d1; font-size: 14px; letter-spacing: 0.5px;">PURCHASE ORDER</p>
                        </td>
                    </tr>

                     <!-- Información de la orden  -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f9fa; border-bottom: 1px solid #e1e8ed;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="width: 33%; padding-right: 20px;">
                                        <p style="margin: 0 0 5px 0; font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">No. de Orden</p>
                                        <p style="margin: 0; font-size: 18px; color: #1a1a2e; font-weight: 600;">OC-${ano}-${basicas.id}</p>
                                    </td>
                                    <td style="width: 33%; text-align: right;">
                                        <p style="margin: 0 0 5px 0; font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">lugar</p>
                                        <p style="margin: 0; font-size: 18px; color: #1a1a2e; font-weight: 600;">${basicas.lugar}</p>
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
                                <tbody>
                                <tr style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);">
                                        <td style="padding: 15px 12px; text-align: center; color: #ffffff; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 8%;">No.</td>
                                        <td style="padding: 15px 12px; text-align: left; color: #ffffff; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 40%;">Servicio/Producto</td>
                                        <td style="padding: 15px 12px; text-align: center; color: #ffffff; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 13%;">Cantidad</td>
                                        <td style="padding: 15px 12px; text-align: right; color: #ffffff; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 19%;">Precio Unit.</td>
                                        <td style="padding: 15px 12px; text-align: right; color: #ffffff; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 20%;">Precio Total</td>
                                    </tr>
                                `
                                let to= partidas
                                partidas = deserializar(partidas.partidas)
                                     for (let i = 0; i < partidas.length; i++) {
                                        let parti = partidas[i]
                                        console.log(`la partida es asi: ${parti}`)
                                        html +=`<tr style="border-bottom: 1px solid #e1e8ed; background-color: #ffffff;">
                                        <td style="padding: 15px 12px; text-align: center; color: #2c3e50; font-size: 14px;">1</td>
                                        <td style="padding: 15px 12px; text-align: left; color: #2c3e50; font-size: 14px;">${parti.item}</td>
                                        <td style="padding: 15px 12px; text-align: center; color: #2c3e50; font-size: 14px;">${parti.producto}</td>
                                        <td style="padding: 15px 12px; text-align: right; color: #2c3e50; font-size: 14px;">${parti.cantidad}</td>
                                        <td style="padding: 15px 12px; text-align: right; color: #2c3e50; font-size: 14px; font-weight: 600;">${parti.precioTotal}</td>
                                    </tr>`     
                                     }

            html+=`
                                </tbody>
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
                                        <span style="font-size: 15px; color: #2c3e50; font-weight: 600;">${to.subtotal}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e1e8ed;">
                                        <span style="font-size: 15px; color: #6c757d; font-weight: 500;">IVA (16%):</span>
                                    </td>
                                    <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #e1e8ed;">
                                        <span style="font-size: 15px; color: #2c3e50; font-weight: 600;">${to.iva}</span>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style="padding: 15px 0 10px 0; background-color: #f8f9fa; padding-left: 15px; border-radius: 6px 0 0 6px;">
                                        <span style="font-size: 17px; color: #1a1a2e; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Total:</span>
                                    </td>
                                    <td style="padding: 15px 0 10px 0; text-align: right; background-color: #f8f9fa; padding-right: 15px; border-radius: 0 6px 6px 0;">
                                        <span style="font-size: 22px; color: #1a1a2e; font-weight: 700;">${to.total}</span>
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
                                <p style="margin: 0; font-size: 15px; color: #2c3e50; line-height: 1.6;">${basicas.observaciones}</p>
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
                                        <div style="background-color: #f8f9fa; border: 2px solid #e1e8ed; border-radius: 8px; padding: 20px 15px; transition: all 0.3s ease;">
                                            <div style="width: 100px; height: 100px; margin: 0 auto 15px auto; border-radius: 5%; overflow: hidden; border: 3px solid #2c3e50; background-color: #ffffff;">
                                                <img src="[URL_IMAGEN_1]" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                                            </div>
                                            <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600; line-height: 1.4;">[NOMBRE_PERSONA_1]</p>
                                            <p style="margin: 5px 0 0 0; font-size: 12px; color: #6c757d; font-weight: 500;">[CARGO_1]</p>
                                        </div>
                                    </td>
                                     <!-- Firma 2  -->
                                    <td style="width: 33.33%; padding: 0 10px; text-align: center; vertical-align: top;">
                                        <div style="background-color: #f8f9fa; border: 2px solid #e1e8ed; border-radius: 8px; padding: 20px 15px; transition: all 0.3s ease;">
                                            <div style="width: 100px; height: 100px; margin: 0 auto 15px auto; border-radius: 50%; overflow: hidden; border: 3px solid #2c3e50; background-color: #ffffff;">
                                                <img src="[URL_IMAGEN_2]" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                                            </div>
                                            <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600; line-height: 1.4;">[NOMBRE_PERSONA_2]</p>
                                            <p style="margin: 5px 0 0 0; font-size: 12px; color: #6c757d; font-weight: 500;">[CARGO_2]</p>
                                        </div>
                                    </td>
                                     <!-- Firma 3  -->
                                    <td style="width: 33.33%; padding: 0 10px; text-align: center; vertical-align: top;">
                                        <div style="background-color: #f8f9fa; border: 2px solid #e1e8ed; border-radius: 8px; padding: 20px 15px; transition: all 0.3s ease;">
                                            <div style="width: 100px; height: 100px; margin: 0 auto 15px auto; border-radius: 50%; overflow: hidden; border: 3px solid #2c3e50; background-color: #ffffff;">
                                                <img src="[URL_IMAGEN_3]" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                                            </div>
                                            <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600; line-height: 1.4;">[NOMBRE_PERSONA_3]</p>
                                            <p style="margin: 5px 0 0 0; font-size: 12px; color: #6c757d; font-weight: 500;">[CARGO_3]</p>
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
                            <p style="margin: 0; font-size: 12px; color: #6c7a9d; line-height: 1.6;">[NOMBRE_EMPRESA] | [TELÉFONO] | [EMAIL]</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
    `
    // codigo del isr
    // <tr>
    //                                 <td style="padding: 10px 0; border-bottom: 1px solid #e1e8ed;">
    //                                     <span style="font-size: 15px; color: #6c757d; font-weight: 500;">ISR:</span>
    //                                 </td>
    //                                 <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #e1e8ed;">
    //                                     <span style="font-size: 15px; color: #2c3e50; font-weight: 600;">$[ISR]</span>
    //                                 </td>
    //                             </tr>
    let dato = {
        destinatario: datos.informacionProveedor.correo,
        asunto:'ORDEN DE COMPRA DE QUALITY BOLCA',
        texto:'TEXTO',
        html:html
    }
    console.log('inicia el proceso de envio')
    try{
    const cor = new nodemailer()
    cor.enviarCorreo({Correo: dato});
    return true
}catch(ex){
        console.log(`surgio un error: ${ex}`)
        return false
    }
}

function deserializar(dato){
    return   JSON.parse(dato)
}
export default envioOC;

