const cleaverForm = document.getElementById("cleaverForm");

cleaverForm.addEventListener("submit", (e) => {

    console.log('entro al boton');
    
    e.preventDefault();
    const formData = new FormData(cleaverForm);
    const urlEncoded = new URLSearchParams(formData).toString();
    fetch("/atraccion/test", {
        method: "POST",
        body: urlEncoded,
        headers: {  
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
        .then((res) => res.json())
        .then((res) => {
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
            }
        });
});