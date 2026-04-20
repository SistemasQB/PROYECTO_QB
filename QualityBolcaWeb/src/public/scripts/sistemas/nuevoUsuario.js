document.getElementById("btnEnvio").addEventListener("click", async () => {

    const form = document.getElementById("userForm");
    const formData = new FormData(form);

    const datos = Object.fromEntries(formData.entries());

    try {

        const response = await fetch("/sistemas/nuevoUsuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const result = await response.json();

        if (result.ok) {
            alert("Usuario creado correctamente");
            form.reset();
        } else {
            alert(result.msg);
        }

    } catch (error) {
        console.error(error);
        alert("Error al registrar usuario");
    }

});

const nombreInput = document.getElementById("nombre");
const apPInput = document.getElementById("apellidopaterno");
const apMInput = document.getElementById("apellidomaterno");
const nombreLargoInput = document.getElementById("nombrelargo");

// Función para generar nombre largo
function generarNombreLargo() {

    const nombre = nombreInput.value.trim();
    const apP = apPInput.value.trim();
    const apM = apMInput.value.trim();

    // Solo genera si hay algo escrito
    if (nombre || apP || apM) {
        nombreLargoInput.value = `${apP} ${apM} ${nombre}`
            .replace(/\s+/g, " ")   // elimina espacios dobles
            .trim()
            .toUpperCase();
    } else {
        nombreLargoInput.value = "";
    }
}

// Escuchar cambios en tiempo real
nombreInput.addEventListener("input", generarNombreLargo);
apPInput.addEventListener("input", generarNombreLargo);
apMInput.addEventListener("input", generarNombreLargo);