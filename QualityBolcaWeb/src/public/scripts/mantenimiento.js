// import { transporter } from "../../index.js";
const btnEnviar = document.getElementById('btnEnviar');

// let mail = {
//     from: "oscar.deluna@qualitybolca.net",
//     to: 'oscar.deluna@qualitybolca.net',
//     subject: 'Mantenimiento',
//     text: 'hola'
// }
btnEnviar.addEventListener("click", () => {

    fetch('/enviarCorreo',{
        method: 'POST'
    }).then(res => {
        if (res.ok) {
            window.alert("Correo Enviado");
        } else {
            window.alert("Error Correo No Enviado");
        }
    })
})
    // async..await is not allowed in global scope, must use a wrapper
    // function Enviarcorreo2() {
        
    
    
//     async function main() {
        // send mail with defined transport object
//         const info = await transporter.sendMail({
//             from: "mantenimiento@qualitybolca.net",
//             to: 'info.sistemas@qualitybolca.com',
//             subject: 'Mantenimiento',
//             text: 'hola',
//           html: "<b>Hello world?</b>", // html body
//         });
      
//         console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
//       }
//       main().catch(console.error);
//   });
    // }


//   export default main();


// btnMantenimientos?.addEventListener('click', e => {
//     e.preventDefault()
//     console.log('BOton presionado');
    
//     main()
// })