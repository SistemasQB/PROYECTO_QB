const tituloModal = document.getElementById('h1TextModal')
const inpTextModal = document.getElementById('inpTextModal')
const formSolicitarC = document.getElementById('formSolicitarC')
const btnEnviarSolcitud = document.getElementById('btnEnviarSolcitud')
const csfrT = document.getElementById('csfrT')

function formulario(datos, correoContacto, nombreContacto) {
    const myModalEl = new bootstrap.Modal('#exampleModal')
    tituloModal.textContent = datos;
    inpTextModal.value = datos;
    myModalEl.show();
    sessionStorage.setItem('correoContacto', correoContacto);
    sessionStorage.setItem('nombreContacto', nombreContacto);
}

function agregarFila() {
    const nombreC = document.getElementById('recipient-name').value;
    const listaNombres = document.getElementById('listaNombres');
    if (nombreC) {
        const tabla = document.getElementById('tableNombresC').getElementsByTagName('tbody')[0];
        const nuevaFila = tabla.insertRow();

        const celdaNombre = nuevaFila.insertCell(0);
        listaNombres.value += nombreC + '▄'
        celdaNombre.textContent = nombreC;
        celdaNombre.classList.add('table-light')

        // table-primary

        document.getElementById('recipient-name').value = '';
    } else {
        // alert("Debe llenar los recuadros no sea ¡Imbecil!");
        Swal.fire({
            title: 'Error',
            icon: 'error',
            // text: 'Debe llenar los recuadros no sea ¡Imbecil!'
            text: 'Debe llenar los recuadros no sea ¡flojo!'
        })
    }
}

formSolicitarC.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(formSolicitarC)
    formData.append('correoContacto', sessionStorage.getItem("correoContacto"));
    formData.append('nombreContacto', sessionStorage.getItem("nombreContacto"));
    const urlEncoded = new URLSearchParams(formData).toString();
    const cookies = document.cookie.substring(6, document.cookie.length)
    console.log(cookies);
    fetch('/admin/cursos', {
        method: 'POST',
        body: urlEncoded,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'X-CSRF-Token': csfrT.value,
            // _csrf: csfrT.value,
            // '_csrf': csfrT.value,
            // 'csrfToken': csfrT.value,
        }
    }).then(
        Swal.fire({
            title: 'Enviado',
            icon: 'success',
            text: 'Informacion enviada con exito'
        }),
        setTimeout(()=> {
            location.href = 'cursos'
        }, 5000)
    ).catch(
        function (error) {
            console.log("Hubo un problema con la petición Fetch:" + error.message);
          }
    )
})
