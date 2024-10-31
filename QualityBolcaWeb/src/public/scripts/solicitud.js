const btnAbrirModal = document.getElementById('enviar-cv');
const btnCerrarModal = document.getElementById('cancelar-cv')
const btnEnviar = document.getElementById('enviar-solicitud')
const modal = document.getElementById('curriculum')


btnAbrirModal.addEventListener('click', ()=>{
    modal.showModal();
})

btnCerrarModal.addEventListener('click', ()=>{
    modal.close();
})

btnEnviar.addEventListener('click', e =>{
    e.preventDefault()
    fetch('/enviar', {
        method: 'POST'
    })
    .then(res => {
        if (res.ok) {
                console.log('enviar informacion')
                // window.location.href = '/nose'
                
        } else {
            console.log('error Usuario o contraseña no valida', res)
        }
    })
})

