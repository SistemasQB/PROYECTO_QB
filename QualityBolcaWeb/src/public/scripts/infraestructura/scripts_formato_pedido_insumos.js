// Inicializar fecha actual
let grupos = [];
let articulos = []
let estadoFormulario = {}

document.addEventListener("DOMContentLoaded", () => {
  // const fechaInput = document.getElementById("fecha")
  // const today = new Date().toISOString().split("T")[0]
  // fechaInput.value = today
  let tabla = document.getElementById("pedidosBody")
  let filas = tabla.querySelectorAll('tr')
  for(const fila of filas){
    cargarInformacion(fila);
  }
  
  let inpPlanta = document.getElementById('planta')
  listaPlantas = plantas.map((p) => {
      return `<option value="${p.planta}">${p.planta}</option>`
  }).join('')
  
  inpPlanta.innerHTML = listaPlantas
})

// Agregar nuevo item
document.getElementById("agregarItem").addEventListener("click", () => {
  const tbody = document.getElementById("pedidosBody")
  const newRow = document.createElement("tr")
  newRow.className = "pedido-row"
  let opci = grupos
                .filter(grupo => grupo && grupo.trim())
                .map(art => `<option value="${art}">${art}</option>` )
                .join('')
  let cont = `
        <td>
            <input type="number" class="cantidad-input" min="1" required>
        </td>
        <td>
          <select class="descripcion-select" data-grupo='grupo' required>
                    <option value="">Seleccione un Grupo de Insumo</option>
                ${opci}
          </select>
        </td>
        <td>
            <select class="descripcion-select" required data-insumo='insumo'>
                <option value="">Seleccione un insumo</option>
                
            </select>
        </td>
        <td>
            <button type="button" class="btn-remove">Eliminar</button>
        </td>`
  newRow.innerHTML = cont
    let input = newRow.querySelector('[data-grupo]')
    input.addEventListener('change',(e) => {
        eventoChange(e.target.value,newRow)
    })
  // logica de evento chage aqui abajito ⬇️


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
  // const folio = document.getElementById("folio").value.trim()
  // const fecha = document.getElementById("fecha").value
  const planta = document.getElementById("planta").value.trim()
  // const solicitante = document.getElementById("solicitante").value.trim()

  if (!planta ) {
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
    planta: planta,
    pedidos: pedidos,
  }

  // Aquí puedes enviar los datos a un servidor
  console.log("Pedido válido:", datosPedido)

  // Mostrar confirmación
  alert(
    "Pedido enviado correctamente!\n\nFolio: " +
      planta +
      "\nTotal de items: " +
      pedidos.length,
  )

  // Opcional: Limpiar formulario después del envío
  // this.reset();
  // location.reload();
})

function mostrarError( mensaje) {
  const errorMessage = document.getElementById("errorMessage")
  errorMessage.textContent = mensaje
  errorMessage.classList.add("show")
  errorMessage.scrollIntoView({ behavior: "smooth", block: "nearest" })
}
function cargarInformacion(fila){
  grupos = [...new Set(productos.map((producto) => {
      return producto.grupo
  }))]
  let input = fila.querySelector('[data-grupo]');
  grupos.sort();
  let pri = `<option value="">Seleccione un Grupo de Insumo</option>`
  let vali = grupos
    .filter((grupo) => {return grupo && grupo.trim()})
    .map((grupo) => {return `<option value="${grupo}">${grupo}</option>`})
  input.innerHTML = pri + vali 
  input.addEventListener('change', (e) => {
    eventoChange(e.target.value, fila)
  })
  
}

function eventoChange(texto, fila){
  let insumos = productos
  .filter((insumo) => insumo.grupo == texto )
  .map((insumo) => insumo.articulo)
  let inpIns= fila.querySelector('[data-insumo]')
  let cont = insumos.map((ele) => {
      return `<option value="${ele}">${ele}</option>`
  }).join('')
  
  inpIns.innerHTML = cont
    
    

}

