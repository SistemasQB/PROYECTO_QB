// const valeForm = document.getElementById('inventoryForm')
const valeForm = document.getElementById('valeForm');

valeForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(valeForm)
    const urlEncoded = new URLSearchParams(formData).toString();

    
    const cookies = document.cookie.substring(6, document.cookie.length)
    fetch('addvales', {
        method: 'POST',
        body: urlEncoded,
        headers: {  
            'Content-Type': 'application/x-www-form-urlencoded',

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
