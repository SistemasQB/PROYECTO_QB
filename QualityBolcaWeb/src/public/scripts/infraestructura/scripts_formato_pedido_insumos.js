
// Inicializar fecha actual
let grupos = [];
let articulos = []
let estadoFormulario = {}
let btnEnvio = document.getElementById('btnEnvio')


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
            <input type="number" data-precioUnitario="unitario" class="input-precio" disabled>
        </td>
        <td>
            <input type="number" data-preciototal="total" class="input-precio" disabled>
        </td>
        <td>
            <button type="button" class="btn-remove">Eliminar</button>
        </td>`
  newRow.innerHTML = cont
    let input = newRow.querySelector('[data-grupo]')
    input.addEventListener('change',(e) => {
        eventoChange(e.target.value,newRow)
    })
    let inpPro =  newRow.querySelector('[data-insumo]')
    inpPro.addEventListener('change', (e) => {
        cambioArticulo(e.target.value, newRow)
    })
    let inpcan =  newRow.querySelector('.cantidad-input')
    inpcan.addEventListener('input', (e) => {
        cambioCantidad(e.target.value, newRow)
    })


  tbody.appendChild(newRow)
  actualizarBotonesEliminar()
})

// Eliminar item
document.getElementById("pedidosBody").addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-remove")) {
    e.target.closest("tr").remove()
    actualizarBotonesEliminar()
    totalizar();
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
btnEnvio.addEventListener("click", async (e) => {
  let formu = document.getElementById('pedidoForm')
  if (formu.checkVisibility()){
    const errorMessage = document.getElementById("errorMessage")
    errorMessage.classList.remove("show")
    errorMessage.textContent = ""

    // Validar campos principales
    const planta = document.getElementById("planta").value.trim()
    
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
      const grupo = row.querySelector(".descripcion-select").value
      const descripcion = row.querySelector("[data-insumo]").value
      const pUnitario = row.querySelector("[data-precioUnitario]").value
      const pTotal = row.querySelector("[data-preciototal]").value

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
        grupo: grupo,
        descripcion: descripcion,
        precioUnitario: Number.parseFloat(pUnitario),
        precioTotal: Number.parseFloat(pTotal),
        surtio: "",
        surtido: 0
      })
    })

    if (!pedidosValidos) {
      return
    }

    // Si todo es válido, preparar datos
    pedidos.push({total: document.getElementById('totalL').textContent})
    const datosPedido = {
      _csrf: tok,
      planta: planta,
      solicitado: pedidos,
      tipo: 'insert'
    }
    
    await alertaFetchCalidad('/infraestructura/crudPedidosInsumos',datosPedido,'/infraestructura/pedidoInsumos')
    // Opcional: Limpiar formulario después del envío
    // this.reset();
    // location.reload();
  }
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
  let inputCant = fila.querySelector('.cantidad-input')
  inputCant.addEventListener('input', (e) => {
    cambioCantidad(e.target.value, fila)
  })
  let inpArt = fila.querySelector('[data-insumo]')
  inpArt.addEventListener('change', (e) => {
    cambioArticulo(e.target.value, fila)
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

function cambioArticulo(nombreArticulo, row){
  let art = productos.find((articulo) => articulo.articulo == nombreArticulo)
  let inpUni = row.querySelectorAll('[data-precioUnitario]')
  let inpTot = row.querySelectorAll('[data-preciototal]')
  let inpCan = row.querySelectorAll('.cantidad-input')
  
  inpUni[0].value = art.costoUnitario
  inpTot[0].value = parseFloat(inpCan[0].value) * parseFloat(inpUni[0].value) || 0
  totalizar()
}
function totalizar(){
  let inputs = document.querySelectorAll('[data-preciototal]')
  let labelT = document.getElementById('totalL')
  let total = 0
  
  for (const input of inputs){
   total +=  parseFloat(input.value)
  }
  labelT.textContent = total.toFixed(2) || 0
}


function cambioCantidad(cantidad, row){
  let inputs = row.querySelector('[data-preciototal]')
  let inpUni = row.querySelector('[data-preciounitario]')
  inputs.value = cantidad * parseFloat(inpUni.value) || 0;
  totalizar()
}

