async function alertaFetchCalidad( link, cuerpo, destino) {
    
    Swal.fire({
        title: 'Procesando...',
        html: '<div class="spinner"></div>',
        showConfirmButton: false,
        allowOutsideClick: false,
    })

    
    fetch(link, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': cuerpo._csrf, 
        },
        body: JSON.stringify(cuerpo),
        credentials: 'include'
        
    })
        .then(response => response.json())
        .then(res => {
            if (res.ok) {
                Swal.close();
                Swal.fire({
                    title: "Enviado",
                    text: res.msg,
                    icon: "success",
                    allowOutsideClick: false,
                    button: "OK"
                }).then((value) => {
                    if (value) {
                        window.location.href = destino
                    }
                });
            } else {
                Swal.close();
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: res.msg,
                    allowOutsideClick: false,
                    button: "OK"
                });
            }
        })
}