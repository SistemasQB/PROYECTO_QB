
async function fetchGenerica(link, cuerpo, destino) {
    Swal.fire({
        title: 'Procesando...',
        html: '<div class="spinner"></div>',
        showConfirmButton: false,
        allowOutsideClick: false,
    });    
    fetch(link, {
        method: 'POST',
        body: cuerpo,
        credentials: 'include',
        headers:{
            'X-CSRF-Token': cuerpo.get("_csrf")
        }
    })
    .then(response => response.json())
    .then(res => {
        Swal.close();
        if (res.ok) {
            Swal.fire({
                title: "Enviado",
                text: res.msg,
                icon: "success",
                allowOutsideClick: false,
                button: "OK"
            }).then(() => {
                window.location.href = destino;
            });
        } else {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: res.msg,
                allowOutsideClick: false,
                button: "OK"
            });
        }
    });
}