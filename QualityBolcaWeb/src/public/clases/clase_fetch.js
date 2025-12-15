

    function envioJson(link, cuerpo, destino){
        console.log(`el link es ${link},  el cuerpo es ${JSON.stringify(cuerpo)} y el destino es ${destino}`);
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
            // 'X-CSRF-Token': cuerpo._csrf, 
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
    function envioFormData(link, cuerpo, destino){
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