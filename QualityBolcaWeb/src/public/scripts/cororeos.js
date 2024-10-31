controlador.correoMejoraContinua = (req, res)=>{
    
    const correo = require('nodemailer');
    let transporte = correo.createTransport({
        host:'smtp.gmail.com',
        type: "OAuth2",
        port: 587,
        service: 'gmail',
        
        // ilppffadvzyoxxcs  qb*2023mejora.
        secure: false,
        auth: {
        // user: process.env.usuario,
        // pass: process.env.contra,
        // accessToken: process.env.accessToken,
        // clientId: process.env.clientId,
        // clienteSecret: process.env.clienteSecret,
        // refreshtoken: process.env.refreshToken}
        // edbr zwnz gavm gmmi ilppffadvzyoxxcs

        user:'propuestas.mejora@gmail.com',
        pass:'edbr zwnz gavm gmmi',
        accessToken: 'ya29.a0Ad52N3-kQyLhwtP7pwTynJ5Rx5ioipXtJulgfPTTR-BuI9EMPqqVs6kaiX9Kg6Cm8Oh7mm6hwiy9f6ztsVwCEd2_mIy9Kj4wykg7mF3ikwFB2gGGwElcclatWDquVSzklXIv9ab5lrTBXUc3h3wZvLZXBcdRcVWC24h7aCgYKAX0SARISFQHGX2Miemnb7YQr8Btup1p1Ma-sSA0171',
        clientId: '203577810248-5j49dltmkfu9m72atf8eci9rofvi4.apps.googleusercontent.com',
        clientSecret:'GOCSPX-ah35cJF41f7NQIPlFYzzncbiZi',
        refreshToken: '1//04zSPhJoeNkECgYARAAGAQSNwF-L9IreQKbVjyvHwLwjnr3FaJbjzPEfWVzY0zNGoYCaBLh0CpowTM1TRahfm3wjDSdAy6_4M'}
    })


    let cuerpo = `<style>
    .encabezado{
        background-color: rgb(18, 18,180);
        color: rgb(254,254,254);
        text-align:center;
        margin: 1%;
        
    }
    .cuerpo{
        background-color: rgb(148, 119, 110);
        color: rgb(1,1,1);
        text-align: left;
        padding: 2%;
        outline: solid rgb(6, 107, 230);
        padding: 5%;
        margin: 1%;
    }

    .foto{
        
        
        
    }
</style>
<div>
    <div class='encabezado'><b><h1>MEJORA CONTINUA</h1></b></div>
    <div class='cuerpo'>
        <p>Buenas tardes, compañeros.</p>
        <p>Seguimos invitándolos a ser partícipes con sus ideas de mejora a el proyecto “Mejora continua 2024”.</p>
        <p>Recuerden que, para registrar sus mejoras, se debe realizar lo siguiente:</p>
        <ul>
            <li><b>Utilizar la aplicación Registro de Mejora Continua que tienen instalada en sus computadores.</b></li>
            <li><b>Agregar el análisis de su propuesta (donde se exponen todos los beneficios que se van a obtener con su implementación).</b></li>
            <li><b>Adjuntar el análisis de su propuesta en formato PDF.</b>            </li>
        </ul>
    </div>
    <div style = "width: 300px; height: 800px; padding: 10px; box-sizing: border-box; border:solid black;">
        <img src='cid:cartel' style="400px; height:800px;">
    </div>
</div>`
let numero    = Math.floor((Math.random() * (4 - 1 + 1)) + 1);
const mailOptions = {
        attachments:[
        {
        filename:'.jpg',
        path:'./src/publico/7.jpg',
        content:"image",
        cid:"cartel"
        
    }],
        from: 'propuestas.mejora@gmail.com',
        to: 'guillermo.reyes@qualitybolca.com.mx',
        subject: 'CONVOCATORIA MEJORA CONTINUA 2024',
        html: cuerpo 
     };
    
    async function envio(){
        
        let envio = await transporte.sendMail(mailOptions, function(error, info){
            if (error) {console.log(error);}
            else {
                console.log(mailOptions);
                console.log('Correo enviado');
                res.render("inicio");
                return 
                };
        });
    }
    envio();    
    
};