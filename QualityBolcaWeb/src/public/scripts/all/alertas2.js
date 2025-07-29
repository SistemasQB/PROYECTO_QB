// import e = require("express");

function alertaFetch(urlEncoded, link, redirect, ruta) {

    Swal.fire({
        title: 'Procesando...',
        html: '<div class="spinner"></div>',
        showConfirmButton: false,
        allowOutsideClick: false,
    })

    fetch(link, {
        method: 'POST',
        body: urlEncoded,
        headers:{
            'X-CSRF-Token': urlEncoded.get("_csrf"),
            ruta: ruta
            // 'X-CSRF-Token': urlEncoded._csrf
        }
    })
        .then(response => response.json())
        .then(res => {
            // console.log(res);
            if (res.ok) {
                Swal.close();
                Swal.fire({
                    title: "Enviado",
                    text: res.msg,
                    icon: "success",
                    allowOutsideClick: false,
                    button: "OK"
                }).then((value) => {
                    if (value && redirect && res.id) {
                        window.location.href = redirect + '/' + res.id
                    }else if (value && redirect) {
                        window.location.href = redirect
                    }else{
                        window.location.href = link
                    }
                });;
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