const buscador = document.querySelector("#buscador")
buscador.addEventListener("keyup", e => {


    if (e.key === "Escape") e.target.value = ""

    document.querySelectorAll(".card").forEach(fruta => {

        fruta.textContent.toLowerCase().includes(e.target.value.toLowerCase())
            ? fruta.classList.remove("hidden")
            : fruta.classList.add("hidden")
    })
})

function añadirFoto(idempleado) {
    window.location.href = `subirfoto/${idempleado}`
}