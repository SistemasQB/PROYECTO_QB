const formularioAdd = document.getElementById('inventoryForm')


formularioAdd.addEventListener('submit', (e) => {
    e.preventDefault()
    // let fechaMantenimiento = document.getElementById('fechaMantenimiento').value
    // if (fechaMantenimiento == '' ) {
    //     fechaMantenimiento = null
    // }
    const formData = new FormData(formularioAdd)
    const urlEncoded = new URLSearchParams(formData).toString();
    // console.log(urlEncoded);
    
    const cookies = document.cookie.substring(6, document.cookie.length)
    fetch('addinventario', {
        method: 'POST',
        body: urlEncoded,
        headers: {  
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'X-CSRF-Token': csfrT.value,
            // _csrf: csfrT.value,
            // '_csrf': csfrT.value,
            // 'csrfToken': csfrT.value,
        }
    }).then(response => response.json())
    .then(res => {
        if (res.ok) {
            swal.fire({
                title: 'Datos guardados',
                icon: 'success',
                text: 'Los datos del inventario han sido guardados correctamente.',
                allowOutsideClick: false,
                button: "OK"
            }).then((value) => {
                if (value) {
                    location.reload();
                }
            });
        } else {
            Swal.fire({
                title: "Error",
                text: "Error al enviar la informacion" + res.error,
                icon: "error",
            });
        }
    })
    
})
