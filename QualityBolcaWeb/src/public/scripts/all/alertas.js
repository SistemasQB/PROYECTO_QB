function alertaFetch(urlEncoded, link) {

    Swal.fire({
        title: 'Procesando...',
        html: '<div class="spinner"></div>',
        showConfirmButton: false,
        allowOutsideClick: false,
    })

    fetch(link, {
        method: 'POST',
        body: urlEncoded,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
        .then(response => response.json())
        .then(res => {
            console.log(res);
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