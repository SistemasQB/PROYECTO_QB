const btnEnviar = document.getElementById('enviar-solicitud')

const solicitudForm = document.getElementById('solicitudForm')


let redirigir

solicitudForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    const formData = new FormData(solicitudForm)
    const urlEncoded = new URLSearchParams(formData).toString();
    
    console.log(urlEncoded);
    
    fetch('/solicitud', {
        method: 'POST',
        body: urlEncoded,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
    })
    .then(response => response.json())
    .then(res => {
        if (res.ok) {
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
          });
          swalWithBootstrapButtons.fire({
            title: "¿Enviar CV?",
            text: "¿Quieres adjuntar tu CV?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si adjuntar!",
            cancelButtonText: "No enviar!",
            reverseButtons: true,
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              location.href = `/subirsolicitud/${res.id}`
            //   swalWithBootstrapButtons.fire({
            //     title: "Redirigiendo",
            //     text: "Presione OK para continuar...",
            //     icon: "info",
            //     allowOutsideClick: false,
            //     button: "OK"
            //   }).then((value) => {
            //     if (value) {
            //         location.href = `/subirsolicitud/${res.id}`
            //     }
            // });
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire({
                title: "Informacion Enviada!",
                text: "Tu informacion ha sido enviada con exito",
                icon: "success",
                allowOutsideClick: false,
                button: "OK"
              }).then((value) => {
                if (value) {
                    location.reload();
                }
            });;
            }
          });
        } else {
            Swal.fire({
                title: "Error",
                text: "Error al enviar la informacion" + res.error,
                icon: "error",
              });
            console.log('error Usuario o contraseña no valida', res)
        }
    })
})


// function alerta() {
//     const swalWithBootstrapButtons = Swal.mixin({
//         customClass: {
//           confirmButton: "btn btn-success",
//           cancelButton: "btn btn-danger"
//         },
//         buttonsStyling: false
//       });
//       swalWithBootstrapButtons.fire({
//         title: "¿Enviar CV?",
//         text: "¿Quieres adjuntar tu CV?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Si adjuntar!",
//         cancelButtonText: "No enviar!",
//         reverseButtons: true,
//         allowOutsideClick: false
//       }).then((result) => {
//         if (result.isConfirmed) {
//           swalWithBootstrapButtons.fire({
//             title: "Redirigiendo",
//             text: "Presione OK para continuar...",
//             icon: "info",
//             allowOutsideClick: false,
//             button: "OK"
//           }).then((value) => {
//             if (value) {
//                 console.log('nose', redirigir);
//                 location.href = `/subirsolicitud/${redirigir}`
//             }
//         });
//         } else if (
//           result.dismiss === Swal.DismissReason.cancel
//         ) {
//           swalWithBootstrapButtons.fire({
//             title: "Informacion Enviada!",
//             text: "Tu informacion ha sido enviada con exito",
//             icon: "success",
//             allowOutsideClick: false,
//             button: "OK"
//           }).then((value) => {
//             if (value) {
//                 location.reload();
//             }
//         });;
//         }
//       });
// }

const inputcp = document.getElementById('cp');

inputcp.addEventListener('change', () => {
    console.log(inputcp.value);
})

function generatePDF() {
    const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const puesto = document.getElementById('puesto').value;
      const sueldo = document.getElementById('sueldo').value;
      const nombre = document.getElementById('nombre').value;
      const apellidoP = document.getElementById('apellidoP').value;
      const apellidoM = document.getElementById('apellidoM').value;
      const correo = document.getElementById('email').value;
      const telefono = document.getElementById('telefono').value;
      const region = document.getElementById('region').value;
      const cp = document.getElementById('cp').value;
      const direccion = document.getElementById('direccion').value;
      const experiencia = document.getElementById('experiencia').value;
      const adeudos = document.querySelector('input[name="adeudos"]:checked').value;

      // Personalizar tamaño, color y posición del texto
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 255); // Azul
      doc.text(`Puesto Solicitado: ${puesto}`, 10, 10);

      doc.setFontSize(14);
      doc.setTextColor(255, 0, 0); // Rojo
      doc.text(`Sueldo Mensual Esperado: ${sueldo}`, 10, 20);

      doc.setFontSize(16);
      doc.setTextColor(0, 128, 0); // Verde
      doc.text(`Nombre: ${nombre}`, 10, 30);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Negro
      doc.text(`Apellido Paterno: ${apellidoP}`, 10, 40);
      doc.text(`Apellido Materno: ${apellidoM}`, 10, 50);
      doc.text(`Correo Electrónico: ${correo}`, 10, 60);
      doc.text(`Número de Teléfono: ${telefono}`, 10, 70);
      doc.text(`Región: ${region}`, 10, 80);
      doc.text(`Código Postal: ${cp}`, 10, 90);
      doc.text(`Dirección: ${direccion}`, 10, 100);
      doc.text(`Experiencia Laboral: ${experiencia}`, 10, 110);
      doc.text(`Adeudos con Banorte: ${adeudos === '1' ? 'Sí' : 'No'}`, 10, 120);

      const date = new Date();
      const fileName = `formulario_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.pdf`;
      doc.save(fileName);
  }



