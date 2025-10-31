// Inicializar fecha actual
document.addEventListener("DOMContentLoaded", () => {
  const fechaInput = document.getElementById("fecha")
  const today = new Date().toISOString().split("T")[0]
  fechaInput.value = today
})

// Agregar nuevo item
document.getElementById("agregarItem").addEventListener("click", () => {
  const tbody = document.getElementById("pedidosBody")
  const newRow = document.createElement("tr")
  newRow.className = "pedido-row"

  newRow.innerHTML = `
        <td>
            <input type="number" class="cantidad-input" min="1" required>
        </td>
        <td>
            <select class="descripcion-select" required>
                <option value="">Seleccione un insumo</option>
                <option value="Papel Bond">Papel Bond</option>
                <option value="Tinta para Impresora">Tinta para Impresora</option>
                <option value="Carpetas">Carpetas</option>
                <option value="Bolígrafos">Bolígrafos</option>
                <option value="Grapas">Grapas</option>
                <option value="Clips">Clips</option>
                <option value="Marcadores">Marcadores</option>
                <option value="Cuadernos">Cuadernos</option>
                <option value="Sobres">Sobres</option>
                <option value="Etiquetas">Etiquetas</option>
            </select>
        </td>
        <td>
            <button type="button" class="btn-remove">Eliminar</button>
        </td>
    `

  tbody.appendChild(newRow)
  actualizarBotonesEliminar()
})

// Eliminar item
document.getElementById("pedidosBody").addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-remove")) {
    e.target.closest("tr").remove()
    actualizarBotonesEliminar()
  }
})

// Actualizar estado de botones eliminar
function actualizarBotonesEliminar() {
  const rows = document.querySelectorAll(".pedido-row")
  const removeButtons = document.querySelectorAll(".btn-remove")

  removeButtons.forEach((btn, index) => {
    btn.disabled = rows.length === 1
  })
}

// Validación y envío del formulario
document.getElementById("pedidoForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const errorMessage = document.getElementById("errorMessage")
  errorMessage.classList.remove("show")
  errorMessage.textContent = ""

  // Validar campos principales
  const folio = document.getElementById("folio").value.trim()
  const fecha = document.getElementById("fecha").value
  const planta = document.getElementById("planta").value.trim()
  const solicitante = document.getElementById("solicitante").value.trim()

  if (!folio || !fecha || !planta || !solicitante) {
    mostrarError("Por favor, complete todos los campos obligatorios del formulario.")
    return
  }

  // Validar pedidos
  const rows = document.querySelectorAll(".pedido-row")
  let pedidosValidos = true
  const pedidos = []

  rows.forEach((row, index) => {
    const cantidad = row.querySelector(".cantidad-input").value
    const descripcion = row.querySelector(".descripcion-select").value

    if (!cantidad || cantidad <= 0) {
      mostrarError(`Por favor, ingrese una cantidad válida en el pedido ${index + 1}.`)
      pedidosValidos = false
      return
    }

    if (!descripcion) {
      mostrarError(`Por favor, seleccione una descripción en el pedido ${index + 1}.`)
      pedidosValidos = false
      return
    }

    pedidos.push({
      cantidad: Number.parseInt(cantidad),
      descripcion: descripcion,
    })
  })

  if (!pedidosValidos) {
    return
  }

  // Si todo es válido, preparar datos
  const datosPedido = {
    folio: folio,
    fecha: fecha,
    planta: planta,
    solicitante: solicitante,
    pedidos: pedidos,
  }

  // Aquí puedes enviar los datos a un servidor
  console.log("Pedido válido:", datosPedido)

  // Mostrar confirmación
  alert(
    "Pedido enviado correctamente!\n\nFolio: " +
      folio +
      "\nFecha: " +
      fecha +
      "\nPlanta: " +
      planta +
      "\nSolicitante: " +
      solicitante +
      "\nTotal de items: " +
      pedidos.length,
  )

  // Opcional: Limpiar formulario después del envío
  // this.reset();
  // location.reload();
})

function mostrarError(mensaje) {
  const errorMessage = document.getElementById("errorMessage")
  errorMessage.textContent = mensaje
  errorMessage.classList.add("show")
  errorMessage.scrollIntoView({ behavior: "smooth", block: "nearest" })
}
