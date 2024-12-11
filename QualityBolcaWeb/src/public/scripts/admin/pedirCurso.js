const btnEnviar = document.getElementById('btnEnviar')
const table = document.querySelector('table')
const tbody = document.querySelector('tbody')
const formSolicitarC = document.getElementById('formData')

var datosCurso

function agregarCurso() {


    const campo1 = document.getElementById('inputCurso')
const campo2 = document.getElementsByClassName('form-check-input')
const campo3 = document.getElementById('floatingTextarea')

    if (campo1.value == "" || campo3.value == "") {
        Swal.fire({
            title: "Error",
            text: "los campos no pueden estar vacios",
            icon: "error"
          });
    }else{
        // crear la lista para agregar los cursos y habilitar el boton de enviar
        table.hidden=false;
            const tr = document.createElement('tr')
            const td1 = document.createElement('td')
            const td2 = document.createElement('td')
            const td3 = document.createElement('td')
    
            td1.textContent = document.getElementById('inputCurso').value
            if (campo2[0].checked) {
                td2.textContent = campo2[0].value
            } else {
                td2.textContent = campo2[1].value
            }
            td3.textContent = document.getElementById('floatingTextarea').value
    
            datosCurso += td1.textContent + '▄' + td2.textContent + '▄' + td3.textContent + '▄'
    
            tbody.appendChild(tr);
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
    
            campo1.value = ""
            campo3.value = ""
            btnEnviar.hidden=false
    }

}

btnEnviar.addEventListener('click', (e)=>{
    e.preventDefault()
    const formData = new FormData(formSolicitarC)
    formData.append('curso', datosCurso);
    const urlEncoded = new URLSearchParams(formData).toString();
    if (document.getElementById('inputNombre').value != "") {
        fetch('/admin/pedirCurso', {
            method: 'POST',
            body: urlEncoded,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(
            Swal.fire({
                title: 'Enviado',
                icon: 'success',
                text: 'Informacion enviada con exito',
                didDestroy: (n) =>{
                    location.reload();
                }
            }),
            setTimeout(()=> {
                location.href = 'cursos'
            }, 5000)
        ).catch(
            function (error) {
                console.log("Hubo un problema con la petición Fetch:" + error.message);
              }
        )
    }else{
        Swal.fire({
            title: "Error",
            text: "El nombre no pueden estar vacios",
            icon: "error",
          });
    }

})